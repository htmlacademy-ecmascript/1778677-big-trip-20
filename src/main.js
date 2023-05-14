import FilterView from './view/filter-view.js';
import BigTripView from './view/big-trip-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { render, RenderPosition } from './framework/render.js';
import { generateFilter } from './mock/filter.js';

const tripInfoContainter = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const bigTripContainer = document.querySelector('.trip-events');

const routePointsModel = new RoutePointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const formPresenter = new TripFormPresenter({
  bigTripContainer: bigTripContainer,
  routePointsModel,
  destinationsModel,
  offersModel
});

const filters = generateFilter(routePointsModel.routePoints);
render(new TripInfoView, tripInfoContainter, RenderPosition.AFTERBEGIN);
render(new FilterView({filters}), filterContainer);
render(new BigTripView(), bigTripContainer);

formPresenter.init();
