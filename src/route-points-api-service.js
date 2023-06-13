import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class RoutePointsApiService extends ApiService {
  get routePoints() {
    return this._load({url: 'big-trip/points'})
      .then(ApiService.parseResponse);
  }

  async updateRoutePoint(routePoint) {
    const response = await this._load({
      url: `big-trip/points/${routePoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(routePoint) {
    const adaptedRoutePoint = {...routePoint,
      'base_price': routePoint.basePrice,
      'date_from': routePoint.dateFrom instanceof Date ? routePoint.dateFrom.toISOString() : null,
      'date_to': routePoint.dateTo instanceof Date ? routePoint.dateTo.toISOString() : null,
      'is_favorite': routePoint.isFavorite,
    };

    // Ненужные ключи мы удаляем
    delete adaptedRoutePoint.basePrice;
    delete adaptedRoutePoint.dateFrom;
    delete adaptedRoutePoint.dateTo;
    delete adaptedRoutePoint.isFavorite;

    return adaptedRoutePoint;
  }
}
