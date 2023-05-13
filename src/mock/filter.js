import {filter} from '../utils/filter-utils.js';

function generateFilter(routePoints) {
  return Object.entries(filter).map(
    ([filterType, filterRoutePoints]) => ({
      type: filterType,
      hasRoutePoints: filterRoutePoints(routePoints).length > 0,
    }),
  );
}

export {generateFilter};
