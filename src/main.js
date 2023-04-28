import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info-view.js';
import {render, RenderPosition} from './render.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';

const tripInfoContainter = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');
const formPresenter = new TripFormPresenter({routePointListContainer: sortContainer});

render(new TripInfoView, tripInfoContainter, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterContainer);
render(new SortView(), sortContainer);

formPresenter.init();
