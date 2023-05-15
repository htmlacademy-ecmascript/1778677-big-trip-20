import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class RoutePointPresenter {
  #routePointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #routePointComponent = null;
  #editFormComponent = null;

  #routePoint = null;
  #destination = null;
  #offers = [];
  #offersByType = [];
  #mode = Mode.DEFAULT;

  constructor({routePointListContainer, onDataChange, onModeChange}) {
    this.#routePointListContainer = routePointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevRoutePointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToRoutePoint();
    }
  }

  #replaceRoutePointToForm() {
    replace(this.#editFormComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToRoutePoint() {
    replace(this.#routePointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#routePoint, isFavorite: !this.#routePoint.isFavorite}, this.#destination, this.#offers, this.#offersByType);
  };

  #handleFormSubmit = (routePoint, destination, offers, offersByType) =>{
    this.#handleDataChange(routePoint, destination, offers, offersByType);
    this.#replaceFormToRoutePoint();
  };


}
