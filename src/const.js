const EMPTY_ROUTEPOINT = {
  id: '',
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DEFAULT: 'day',
  DURATION_TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_ROUTEPOINT: 'UPDATE_ROUTEPOINT',
  ADD_ROUTEPOINT: 'ADD_ROUTEPOINT',
  DELETE_ROUTEPOINT: 'DELETE_ROUTEPOINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

export { EMPTY_ROUTEPOINT, FilterType, SortType, UserAction, UpdateType };

