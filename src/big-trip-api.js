import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class BigTripApi extends ApiService {
  constructor(endPoint, authorization) {
    super(endPoint, authorization);
  }

  async getPoints() {
    const response = await this._load({ url: 'points' });
    const points = await ApiService.parseResponse(response);
    return points.map((point) => this.#adaptToClient(point));
  }

  async getDestinations() {
    const response = await this._load({ url: 'destinations' });
    const destinations = await ApiService.parseResponse(response);
    return destinations;
  }

  async getOffers() {
    const response = await this._load({ url: 'offers' });
    const offers = await ApiService.parseResponse(response);
    return this.#adaptOffersToClient(offers);
  }

  async updatePoint(point) {
    const pointToServer = this.#adaptToServer(point);
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(pointToServer),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const updatedPoint = await ApiService.parseResponse(response);
    return this.#adaptToClient(updatedPoint);
  }

  #adaptToServer(point) {
    let destinationId = point.destination;
    if (typeof point.destination === 'object' && point.destination.id) {
      destinationId = point.destination.id;
    }

    return {
      id: point.id,
      type: point.type,
      destination: destinationId,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      'base_price': point.basePrice,
      'is_favorite': point.isFavorite,
      offers: point.offers || []
    };
  }

  #adaptToClient(point) {
    return {
      id: point.id,
      type: point.type,
      destination: point.destination,
      dateFrom: point['date_from'] ? new Date(point['date_from']) : null,
      dateTo: point['date_to'] ? new Date(point['date_to']) : null,
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
      offers: point.offers || [],
    };
  }

  #adaptOffersToClient(offers) {
    const offersByType = {};
    offers.forEach((offerGroup) => {
      const type = offerGroup.type;
      const offersList = offerGroup.offers || [];
      offersByType[type] = offersList.map((offer) => ({
        id: offer.id,
        title: offer.title,
        price: offer.price
      }));
    });
    return offersByType;
  }
}
