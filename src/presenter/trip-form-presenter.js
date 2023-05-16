import RoutePointListView from '../view/route-point-list-view.js';
import NoRoutePointView from '../view/no-route-point-view.js';
import SortView from '../view/sort-view.js';
import BigTripView from '../view/big-trip-view.js';
import RoutePointPresenter from './route-point-presenter.js';
import {render, RenderPosition} from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { sortByDay, sortByDurationTime, sortByPrice } from '../utils/route-point-utils.js';
import {SortType} from '../const.js';

export default class TripFormPresenter {
  #bigTripComponent = new BigTripView();
  #bigTripContainer = null;
  #routePointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePointListComponent = new RoutePointListView();
  #sortComponent = null;
  #noRoutePointComponent = new NoRoutePointView();

  #tripRoutePoints = [];
  #routePointsPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedRoutePoints = [];


  constructor({bigTripContainer, routePointsModel, destinationsModel, offersModel}) {
    this.#bigTripContainer = bigTripContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#tripRoutePoints = [...this.#routePointsModel.routePoints].sort(sortByDay);
    this.#sourcedRoutePoints = [...this.#routePointsModel.routePoints].sort(sortByDay);
    this.#renderBigTrip();
  }

  #handleModeChange = () => {
    this.#routePointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleRoutePointChange = (updatedRoutePoint, destination, offers, offersByType) => {
    this.#tripRoutePoints = updateItem(this.#tripRoutePoints, updatedRoutePoint);
    this.#sourcedRoutePoints = updateItem(this.#sourcedRoutePoints, updatedRoutePoint);
    this.#routePointsPresenters.get(updatedRoutePoint.id).init(updatedRoutePoint, destination, offers, offersByType);
  };

  #sortRoutePoints(sortType) {
    switch (sortType) {
      case SortType.DURATION_TIME:
        this.#tripRoutePoints.sort(sortByDurationTime);
        break;
      case SortType.PRICE:
        this.#tripRoutePoints.sort(sortByPrice);
        break;
      case SortType.DEFAULT:
        this.#tripRoutePoints.sort(sortByDay);
        break;
      default:
        this.#tripRoutePoints = [...this.#sourcedRoutePoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortRoutePoints(sortType);
    this.#clearRoutesPointList();
    this.#renderRoutesPointList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#bigTripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoRoutePoints() {
    render(this.#noRoutePointComponent, this.#bigTripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderRoutesPointList() {
    render(this.#routePointListComponent, this.#bigTripContainer);
    this.#renderRoutePoints();
  }

  #renderRoutePoints(){
    for (let i = 0; i < this.#tripRoutePoints.length; i++) {
      const destination = this.#destinationsModel.getById(this.#tripRoutePoints[i]);
      const offers = this.#offersModel.getById(this.#tripRoutePoints[i]);
      const offersByType = this.#offersModel.getByType(this.#tripRoutePoints[i]);
      this.#renderRoutePoint(this.#tripRoutePoints[i], destination, offers, offersByType);
    }
  }

  #renderRoutePoint(routePoint, destination, offers, offersByType) {
    const routePointPresenter = new RoutePointPresenter({
      routePointListContainer: this.#routePointListComponent.element,
      onDataChange: this.#handleRoutePointChange,
      onModeChange: this.#handleModeChange
    });
    routePointPresenter.init(routePoint, destination, offers, offersByType);
    this.#routePointsPresenters.set(routePoint.id, routePointPresenter);
  }

  #clearRoutesPointList() {
    this.#routePointsPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointsPresenters.clear();
  }


  #renderBigTrip(){
    render(this.#bigTripComponent, this.#bigTripContainer);
    if (this.#tripRoutePoints.length === 0) {
      this.#renderNoRoutePoints();
      return;
    }
    this.#renderSort();
    this.#renderRoutesPointList();
  }

}
