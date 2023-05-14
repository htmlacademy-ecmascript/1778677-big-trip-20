import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class RoutePointPresenter {
  #routePointListContainer = null;

  #routePointComponent = null;
  #editFormComponent = null;

  #routePoint = null;
  #destination = null;
  #offers = [];
  #offersByType = [];

  constructor({routePointListContainer}) {
    this.#routePointListContainer = routePointListContainer;
  }

  init(routePoint, destination, offers, offersByType){
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;
    this.#offersByType = offersByType;

    const prevRoutePointComponent = this.#routePointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#routePointComponent = new RoutePointView({
      routePoint: this.#routePoint,
      destination: this.#destination,
      offers: this.#offers,
      onClick: this.#handleClick,
    });

    this.#editFormComponent = new EditFormView({
      destination: this.#destination,
      routePoint: this.#routePoint,
      offers: this.#offersByType,
      onFormSubmit: this.#handleFormSubmit});

    if (prevRoutePointComponent === null || prevEditFormComponent === null) {
      render(this.#routePointComponent, this.#routePointListContainer);
      return;
    }

    if (this.#routePointListContainer.contains(prevRoutePointComponent.element)) {
      replace(this.#routePointComponent, prevRoutePointComponent);
    }

    if (this.#routePointListContainer.contains(prevEditFormComponent.element)) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevRoutePointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editFormComponent);
  }

  #replaceRoutePointToForm() {
    replace(this.#editFormComponent, this.#routePointComponent);
  }

  #replaceFormToRoutePoint() {
    replace(this.#routePointComponent, this.#editFormComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToRoutePoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleClick = () => {
    this.#replaceRoutePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () =>{
    this.#replaceFormToRoutePoint();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };


}
