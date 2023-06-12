import BigTripView from './view/big-trip-view.js';
import TripInfoView from './view/trip-info-view.js';
import NewRoutePointButtonView from './view/new-route-point-button-view.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { render, RenderPosition } from './framework/render.js';
import FilterModel from './model/filter-model.js';


const tripInfoContainter = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const bigTripContainer = document.querySelector('.trip-events');

const routePointsModel = new RoutePointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const formPresenter = new TripFormPresenter({
  bigTripContainer: bigTripContainer,
  routePointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewRoutePointDestroy: handleNewRoutePointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  routePointsModel
});

const newRoutePointButtonComponent = new NewRoutePointButtonView({
  onClick: handleNewRoutePointButtonClick
});

function handleNewRoutePointFormClose() {
  newRoutePointButtonComponent.element.disabled = false;
}

function handleNewRoutePointButtonClick() {
  formPresenter.createRoutePoint();
  newRoutePointButtonComponent.element.disabled = true;
}

render(new TripInfoView, tripInfoContainter, RenderPosition.AFTERBEGIN);
render(newRoutePointButtonComponent, tripInfoContainter);
filterPresenter.init();
render(new BigTripView(), bigTripContainer);
formPresenter.init();
