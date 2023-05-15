import RoutePointListView from '../view/route-point-list-view.js';
import NoRoutePointView from '../view/no-route-point-view.js';
import SortView from '../view/sort-view.js';
import BigTripView from '../view/big-trip-view.js';
import RoutePointPresenter from './route-point-presenter.js';
import {render, RenderPosition} from '../framework/render.js';
import { updateItem } from '../utils/common.js';


export default class TripFormPresenter {
  #bigTripComponent = new BigTripView();
  #bigTripContainer = null;
  #routePointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePointListComponent = new RoutePointListView();
  #sortComponent = new SortView();
  #noRoutePointComponent = new NoRoutePointView();

  #tripRoutePoints = [];
  #routePointsPresenters = new Map();


  constructor({bigTripContainer, routePointsModel, destinationsModel, offersModel}) {
    this.#bigTripContainer = bigTripContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#tripRoutePoints = [...this.#routePointsModel.routePoints];
    this.#renderBigTrip();
  }

  #handleModeChange = () => {
    this.#routePointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleRoutePointChange = (updatedRoutePoint, destination, offers, offersByType) => {
    this.#tripRoutePoints = updateItem(this.#tripRoutePoints, updatedRoutePoint);
    this.#routePointsPresenters.get(updatedRoutePoint.id).init(updatedRoutePoint, destination, offers, offersByType);
  };

  #renderSort() {
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

  #clearRoutePontList() {
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
