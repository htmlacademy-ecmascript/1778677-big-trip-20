import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import {render} from '../framework/render.js';


export default class TripFormPresenter {
  #routePointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #routePointListContainer = null;
  #routePointListComponent = new RoutePointListView();
  #tripRoutePoints = [];

  constructor({routePointListContainer, routePointsModel, destinationsModel, offersModel}) {
    this.#routePointListContainer = routePointListContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#tripRoutePoints = [...this.#routePointsModel.routePoints];

    render(this.#routePointListComponent, this.#routePointListContainer);


    render(new EditFormView({
      destination: this.#destinationsModel.getById(this.#tripRoutePoints[0]),
      routePoint: this.#tripRoutePoints[0],
      offers: this.#offersModel.getByType(this.#tripRoutePoints[0]),
    }), this.#routePointListComponent.element);

    for (let i = 1; i < this.#tripRoutePoints.length; i++) {
      const destination = this.#destinationsModel.getById(this.#tripRoutePoints[i]);
      const offers = this.#offersModel.getById(this.#tripRoutePoints[i]);
      render(new RoutePointView({routePoint: this.#tripRoutePoints[i], destination: destination, offers: offers}), this.#routePointListComponent.element);
    }

  }
}
