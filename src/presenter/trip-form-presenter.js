import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import {render, replace} from '../framework/render.js';


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
    this.#renderRoutesPointList();
  }

  #renderRoutesPointList(){
    render(this.#routePointListComponent, this.#routePointListContainer);

    for (let i = 0; i < this.#tripRoutePoints.length; i++) {
      const destination = this.#destinationsModel.getById(this.#tripRoutePoints[i]);
      const offers = this.#offersModel.getById(this.#tripRoutePoints[i]);
      const offersByType = this.#offersModel.getByType(this.#tripRoutePoints[i]);
      this.#renderRoutePoint(this.#tripRoutePoints[i], destination, offers, offersByType);
    }
  }

  #renderRoutePoint(routePoint, destination, offers, offersByType) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToRoutePoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const routePointComponent = new RoutePointView({routePoint, destination, offers, onClick: () => {
      replaceRoutePointToForm(); document.addEventListener('keydown', escKeyDownHandler);
    } });
    const editFormViewComponent = new EditFormView({destination, routePoint, offers: offersByType, onFormSubmit: () => {
      replaceFormToRoutePoint(); document.addEventListener('keydown', escKeyDownHandler);
    } });
    render(routePointComponent, this.#routePointListComponent.element);

    function replaceRoutePointToForm () {
      replace(editFormViewComponent, routePointComponent);
    }
    function replaceFormToRoutePoint(){
      replace(routePointComponent, editFormViewComponent);
    }
  }

}
