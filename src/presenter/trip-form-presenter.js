import TripInfoView from '../view/trip-info-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import NoRoutePointView from '../view/no-route-point-view.js';
import SortView from '../view/sort-view.js';
import BigTripView from '../view/big-trip-view.js';
import LoadingView from '../view/loading-view.js';
import NewRoutePointButtonView from '../view/new-route-point-button-view.js';
import ServerNotAvailibleView from '../view/server-not-avalible-view.js';
import RoutePointPresenter from './route-point-presenter.js';
import NewRoutePointPresenter from './new-route-point-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortByDay, sortByDurationTime, sortByPrice } from '../utils/route-point-utils.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter-utils.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class TripFormPresenter {
  #tripInfoComponent = null;
  #bigTripComponent = new BigTripView();
  #tripInfoContainter = null;
  #bigTripContainer = null;
  #routePointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #routePointListComponent = new RoutePointListView();
  #newRoutePointButtonComponent = null;
  #loadingComponent = new LoadingView();
  #serverNotAvailibleComponent = new ServerNotAvailibleView();
  #sortComponent = null;
  #noRoutePointComponent = null;

  #routePointsPresenters = new Map();
  #newRoutePointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #areDestinationsLoaded = false;
  #areOffersLoaded = false;
  #areRoutePointsLoaded = false;
  #isLoading = true;
  #isErrorMessage = false;
  #isCreating = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({bigTripContainer, tripInfoContainter, routePointsModel, destinationsModel, offersModel, filterModel}) {
    this.#bigTripContainer = bigTripContainer;
    this.#tripInfoContainter = tripInfoContainter;
    this.#routePointsModel = routePointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    const handleNewRoutePointButtonClick = () => {
      this.#isCreating = true;
      this.createRoutePoint();
      this.#newRoutePointButtonComponent.element.disabled = true;
    };

    this.#newRoutePointButtonComponent = new NewRoutePointButtonView({
      onClick: handleNewRoutePointButtonClick
    });

    const handleNewRoutePointFormClose = () => {
      this.#isCreating = false;
      this.#newRoutePointButtonComponent.element.disabled = false;
      if (this.routePoints.length === 0) {
        this.#renderNoRoutePoints();
        remove(this.#sortComponent);
      }
    };

    this.#newRoutePointPresenter = new NewRoutePointPresenter({
      routePointListContainer: this.#routePointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: handleNewRoutePointFormClose
    });
  }

  get routePoints() {
    this.#filterType = this.#filterModel.filter;
    const routePoints = this.#routePointsModel.routePoints;
    const filteredRoutePoints = filter[this.#filterType](routePoints);
    switch (this.#currentSortType){
      case SortType.DURATION_TIME:
        return filteredRoutePoints.sort(sortByDurationTime);
      case SortType.PRICE:
        return filteredRoutePoints.sort(sortByPrice);
      case SortType.DEFAULT:
        return filteredRoutePoints.sort(sortByDay);
    }
    return filteredRoutePoints;
  }

  init() {
    this.#renderBigTrip();
  }

  createRoutePoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newRoutePointPresenter.init();
  }

  #renderTripInfo() {
    const routePoints = [...this.#routePointsModel.routePoints].sort(sortByDay);
    if(!routePoints.length){
      return '';
    }
    this.#tripInfoComponent = new TripInfoView(routePoints, this.#destinationsModel.destinations, this.#offersModel.offers);
    render(this.#tripInfoComponent, this.#tripInfoContainter, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#bigTripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#bigTripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderServerNotAvailibleMessage() {
    this.#isErrorMessage = true;
    render(this.#serverNotAvailibleComponent, this.#bigTripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoRoutePoints() {
    this.#noRoutePointComponent = new NoRoutePointView({
      filterType: this.#filterType
    });
    if(!this.#isErrorMessage){
      render(this.#noRoutePointComponent, this.#bigTripComponent.element, RenderPosition.AFTERBEGIN);
    }
  }

  #clearTripForm({resetSortType = false} = {}) {
    remove(this.#tripInfoComponent);
    this.#newRoutePointPresenter.destroy();

    this.#routePointsPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noRoutePointComponent) {
      remove(this.#noRoutePointComponent);
    }
    if (this.#serverNotAvailibleComponent) {
      remove(this.#serverNotAvailibleComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderRoutePoints(){
    this.routePoints.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter({
      routePointListContainer: this.#routePointListComponent.element,
      destinationsModel: this.#destinationsModel,
      routePointsModel: this.#routePointsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    routePointPresenter.init(routePoint);
    this.#routePointsPresenters.set(routePoint.id, routePointPresenter);
  }

  #renderBigTrip(){
    render(this.#bigTripComponent, this.#bigTripContainer);
    this.#renderTripInfo();
    render(this.#newRoutePointButtonComponent, this.#tripInfoContainter);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.routePoints.length === 0 && !this.#isErrorMessage && !this.#isCreating) {
      this.#renderNoRoutePoints();
      return;
    }
    if(this.#isErrorMessage){
      this.#newRoutePointButtonComponent.element.disabled = true;
      this.#renderServerNotAvailibleMessage();
      return;
    }
    this.#renderSort();
    render(this.#routePointListComponent, this.#bigTripComponent.element);
    this.#renderRoutePoints();
  }

  #handleModeChange = () => {
    this.#newRoutePointPresenter.destroy();
    this.#routePointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_ROUTEPOINT:
        this.#routePointsPresenters.get(update.id).setSaving();
        try {
          await this.#routePointsModel.updateRoutePoint(updateType, update);
        } catch(err) {
          this.#routePointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_ROUTEPOINT:
        this.#newRoutePointPresenter.setSaving();
        try {
          await this.#routePointsModel.addRoutePoint(updateType, update);
        } catch(err) {
          this.#newRoutePointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_ROUTEPOINT:
        this.#routePointsPresenters.get(update.id).setDeleting();
        try {
          await this.#routePointsModel.deleteRoutePoint(updateType, update);
        } catch(err) {
          this.#routePointsPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#routePointsPresenters.get(data.id).init(data);
        remove(this.#tripInfoComponent);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearTripForm();
        this.#renderBigTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTripForm({resetSortType: true});
        this.#renderBigTrip();
        break;
      case UpdateType.DESTINATIONS:
        this.#areDestinationsLoaded = true;
        break;
      case UpdateType.OFFERS:
        this.#areOffersLoaded = true;
        break;
      case UpdateType.ROUTEPOINTS:
        this.#areRoutePointsLoaded = true;
        break;
      case UpdateType.INIT:
        if (!this.#areDestinationsLoaded || !this.#areOffersLoaded || !this.#areRoutePointsLoaded) {
          return;
        }
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearTripForm();
        this.#renderBigTrip();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#isErrorMessage = true;
        remove(this.#loadingComponent);
        this.#clearTripForm();
        this.#renderBigTrip();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTripForm();
    this.#renderBigTrip();
  };

}
