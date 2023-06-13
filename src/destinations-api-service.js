import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({url: 'big-trip/destinations'})
      .then(ApiService.parseResponse);
  }

  async updateDestination(destination) {
    const response = await this._load({
      url: `destinations/${destination.id}`,
      method: Method.PUT,
      body: JSON.stringify(destination),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
