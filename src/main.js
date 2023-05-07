import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info-view.js';
import {render, RenderPosition} from './render.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

const tripInfoContainter = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');

const routePointsModel = new RoutePointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const formPresenter = new TripFormPresenter({
  routePointListContainer: sortContainer,
  routePointsModel,
  destinationsModel,
  offersModel
});

render(new TripInfoView, tripInfoContainter, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterContainer);
render(new SortView(), sortContainer);

formPresenter.init();
