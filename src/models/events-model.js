import { getNextEventPoint, resetEventPointIndex } from '../mock/event-point.js';

const EVENT_COUNT = 6;

export default class EventsModel {
  constructor() {
    resetEventPointIndex();

    this.events = Array.from({ length: EVENT_COUNT }, () => {
      const point = getNextEventPoint();
      return point;
    });
  }

  getEvents() {
    return this.events;
  }

  getEventById(id) {
    return this.events.find((event) => event.id === id) || null;
  }

  getAllFullEvents() {
    return this.events;
  }

  addEvent(event) {
    this.events = [event, ...this.events];
  }

  updateEvent(updatedEvent) {
    this.events = this.events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
  }

  deleteEvent(eventId) {
    this.events = this.events.filter((event) => event.id !== eventId);
  }
}
