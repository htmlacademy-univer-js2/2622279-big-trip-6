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
      // API сервис уже возвращает адаптированные данные
      const points = await this.#apiService.getPoints();
      const destinations = await this.#apiService.getDestinations();
      const offers = await this.#apiService.getOffers();

      this.#events = points; // Уже адаптированы в api-service
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

  addEvent(event) {
    this.#events = [event, ...this.#events];
    this._notify(UpdateType.MINOR);
    return event;
  }

  deleteEvent(eventId) {
    this.#events = this.#events.filter((event) => event.id !== eventId);
    this._notify(UpdateType.MINOR);
  }
}
