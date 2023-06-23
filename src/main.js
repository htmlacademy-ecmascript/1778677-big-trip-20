import TripFormPresenter from './presenter/trip-form-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import RoutePointsApiService from './route-points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';

const AUTHORIZATION = 'Basic yS2sfS74ycl2s92m';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripInfoContainter = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const bigTripContainer = document.querySelector('.trip-events');

const filterModel = new FilterModel();
const routePointsModel = new RoutePointsModel({
  routePointsApiService: new RoutePointsApiService(END_POINT, AUTHORIZATION)
});
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

const formPresenter = new TripFormPresenter({
  bigTripContainer: bigTripContainer,
  tripInfoContainter: tripInfoContainter,
  routePointsModel,
  destinationsModel,
  offersModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  routePointsModel
});

filterPresenter.init();
destinationsModel.init();
offersModel.init();
routePointsModel.init();
formPresenter.init();

