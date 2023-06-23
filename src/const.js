const EMPTY_ROUTE_POINT = {
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
  DESTINATIONS: 'DESTINATIONS',
  OFFERS:'OFFERS',
  ROUTEPOINTS: 'ROUTEPOINTS',
};

const FormatPattern = {
  TRIP_INFO_DATE: 'D MMM',
  DATE: 'MMM D',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YY HH:mm',
};

export { EMPTY_ROUTE_POINT, FilterType, SortType, UserAction, UpdateType, FormatPattern };

