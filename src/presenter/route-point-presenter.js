import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class RoutePointPresenter {
  #routePointListContainer = null;
  #handleDataChange = null;

  #routePointComponent = null;
  #editFormComponent = null;

  #routePoint = null;
  #destination = null;
  #offers = [];
  #offersByType = [];

  constructor({routePointListContainer, onDataChange}) {
    this.#routePointListContainer = routePointListContainer;
    this.#handleDataChange = onDataChange;
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
      onFavoriteClick: this.#handleFavoriteClick
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#routePoint, isFavorite: !this.#routePoint.isFavorite}, this.#destination, this.#offers, this.#offersByType);
  };

  #handleFormSubmit = (routePoint, destination, offers, offersByType) =>{
    this.#handleDataChange(routePoint, destination, offers, offersByType);
    this.#replaceFormToRoutePoint();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };


}
