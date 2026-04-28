import { getAllEventPoints } from '../mock/event-point.js';
import { UpdateType } from '../const.js';

export default class EventsModel {
  #events = [];
  #observers = [];

  constructor() {
    this.#init();
  }

  #init() {
    this.#events = getAllEventPoints();
  }

  getEvents() {
    return this.#events;
  }

  getEventById(id) {
    return this.#events.find((event) => event.id === id) || null;
  }

  getAllFullEvents() {
    return [...this.#events];
  }

  addEvent(event) {
    const newEvent = {
      ...event,
      id: event.id || `event-${Date.now()}`
    };
    this.#events = [newEvent, ...this.#events];
    this.#notify(UpdateType.MINOR);
    return newEvent;
  }

  updateEvent(updatedEvent) {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);
    if (index !== -1) {
      this.#events[index] = { ...this.#events[index], ...updatedEvent };
      this.#notify(UpdateType.MINOR);
    }
  }

  deleteEvent(eventId) {
    this.#events = this.#events.filter((event) => event.id !== eventId);
    this.#notify(UpdateType.MINOR);
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  #notify(updateType) {
    this.#observers.forEach((observer) => observer(updateType));
  }
}
