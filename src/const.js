const TYPES = ['taxi', 'flight', 'drive', 'check-in', 'sightseeing'];

const CITY_NAMES = ['Amsterdam', 'Chamonix', 'Geneva', 'Rome', 'New York'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Aliquam erat volutpat',
  'Nunc fermentum tortor ac porta dapibus',
  'In rutrum ac purus sit amet tempus.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.'
];

const OFFERS = ['Order Uber', 'Add luggage', 'Switch to comfort', 'Rent a car', 'Add breakfast', 'Book tickets', 'Lunch in city'];

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

export {TYPES, CITY_NAMES, DESCRIPTIONS, OFFERS, EMPTY_ROUTEPOINT};

