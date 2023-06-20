import RoutePointListView from '../view/route-point-list-view.js';
import NoRoutePointView from '../view/no-route-point-view.js';
import SortView from '../view/sort-view.js';
import BigTripView from '../view/big-trip-view.js';
import LoadingView from '../view/loading-view.js';
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
  #bigTripComponent = new BigTripView();
  #bigTripContainer = null;
  #routePointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #routePointListComponent = new RoutePointListView();
  #loadingComponent = new LoadingView();
  #serverNotAvailibleComponent = new ServerNotAvailibleView();
  #sortComponent = null;
  #noRoutePointComponent = null;

  #routePointsPresenters = new Map();
  #newRoutePointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isErrorMessage = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({bigTripContainer, routePointsModel, destinationsModel, offersModel, filterModel, onNewRoutePointDestroy}) {
    this.#bigTripContainer = bigTripContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newRoutePointPresenter = new NewRoutePointPresenter({
      routePointListContainer: this.#routePointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewRoutePointDestroy
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
        break;
      case UpdateType.MINOR:
        this.#clearTripForm();
        this.#renderBigTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTripForm({resetSortType: true});
        this.#renderBigTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBigTrip();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderServerNotAvailibleMessage();
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.routePoints.length === 0) {
      this.#renderNoRoutePoints();
      return;
    }
    this.#renderSort();
    render(this.#routePointListComponent, this.#bigTripComponent.element);
    this.#renderRoutePoints();
  }

}
