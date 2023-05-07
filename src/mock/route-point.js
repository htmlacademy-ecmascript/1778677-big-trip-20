import { mockDestinations } from './destination.js';

const mockRoutePoints = [
  {
    id: '1',
    basePrice: 1100,
    dateFrom: new Date('2019-07-10T22:55:56.845Z'),
    dateTo: new Date('2019-07-11T11:22:13.375Z'),
    destination: mockDestinations[0].id,
    isFavorite: false,
    offers: ['1'],
    type: 'taxi'
  },
  {
    id: '2',
    basePrice: 1200,
    dateFrom: new Date('2019-03-10T22:55:56.845Z'),
    dateTo: new Date('2019-04-11T11:22:13.375Z'),
    destination: mockDestinations[1].id,
    isFavorite: true,
    offers: ['1','2'],
    type: 'flight'
  },
  {
    id: '3',
    basePrice: 500,
    dateFrom: new Date('2019-05-11T22:55:56.845Z'),
    dateTo: new Date('2019-05-12T11:22:13.375Z'),
    destination: mockDestinations[2].id,
    isFavorite: false,
    offers: ['2'],
    type: 'check-in'
  },

];

export {mockRoutePoints};
