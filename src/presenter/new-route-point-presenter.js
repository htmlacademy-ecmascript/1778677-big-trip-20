import {remove, render, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';
import RoutePointsModel from '../model/route-points-model.js';

export default class NewRoutePointPresenter {
  #routePointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePointEditComponent = null;

  constructor({routePointListContainer, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#routePointListContainer = routePointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#routePointEditComponent !== null) {
      return;
    }

    this.#routePointEditComponent = new EditFormView({
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#routePointEditComponent, this.#routePointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#routePointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#routePointEditComponent);
    this.#routePointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (routePoint) => {
    if(RoutePointsModel.isFilled(routePoint)){
      this.#handleDataChange(
        UserAction.ADD_ROUTEPOINT,
        UpdateType.MINOR,
        {id: nanoid(), ...routePoint},
      );
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
