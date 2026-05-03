import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #events = [];
  #destinations = [];
  #offers = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      const points = await this.#apiService.getPoints();
      const destinations = await this.#apiService.getDestinations();
      const offers = await this.#apiService.getOffers();

      this.#events = points;
      this.#destinations = destinations;
      this.#offers = offers;

      this._notify(UpdateType.INIT);
    } catch (err) {
      this._notify(UpdateType.ERROR);
    }
  }

  getEvents() {
    return this.#events;
  }

  getAllFullEvents() {
    return this.#events;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getEventById(id) {
    return this.#events.find((event) => event.id === id);
  }

  async updateEvent(updateType, updatedEvent) {
    try {
      const response = await this.#apiService.updatePoint(updatedEvent);
      const index = this.#events.findIndex((event) => event.id === response.id);
      if (index !== -1) {
        this.#events[index] = response;
        this._notify(updateType);
      }
    } catch (err) {
      throw new Error('Failed to update event');
    }
  }

  async addEvent(updateType, event) {
    try {
      const response = await this.#apiService.addPoint(event);
      this.#events = [response, ...this.#events];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Failed to add event');
    }
  }

  async deleteEvent(updateType, eventId) {
    try {
      await this.#apiService.deletePoint(eventId);
      const index = this.#events.findIndex((event) => event.id === eventId);
      if (index !== -1) {
        this.#events = [...this.#events.slice(0, index), ...this.#events.slice(index + 1)];
        this._notify(updateType);
      }
    } catch (err) {
      throw new Error('Failed to delete event');
    }
  }
}
