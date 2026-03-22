import { render } from '../framework/render.js';
import SortingView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';
import InfoView from '../view/info-view.js';
import EventPresenter from './event-presenter.js';

export default class Presenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #filtersComponent = null;
  #sortingComponent = null;
  #infoComponent = null;
  #eventPresenters = new Map();

  constructor({ filtersContainer, eventsContainer, eventsModel, offersModel, destinationsModel }) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#renderInfo();
    this.#renderFilters();
    this.#renderSorting();
    this.#renderEvents();
  }

  #renderInfo() {
    const events = this.#eventsModel.getAllFullEvents();

    if (events.length === 0) {
      return;
    }

    const destinations = events.map((event) => {
      if (this.#destinationsModel) {
        const destination = this.#destinationsModel.getById(event.destination);
        return destination?.name || '';
      }
      return event.destination?.name || '';
    }).filter(Boolean);

    const uniqueDestinations = [...new Set(destinations)];
    let title = '';
    if (uniqueDestinations.length === 1) {
      title = uniqueDestinations[0];
    } else if (uniqueDestinations.length === 2) {
      title = `${uniqueDestinations[0]} &mdash; ${uniqueDestinations[1]}`;
    } else if (uniqueDestinations.length > 2) {
      title = `${uniqueDestinations[0]} &mdash; ... &mdash; ${uniqueDestinations[uniqueDestinations.length - 1]}`;
    }

    const dates = events.map((event) => new Date(event.dateFrom));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const dateString = `${formatDate(minDate)}&nbsp;&mdash;&nbsp;${formatDate(maxDate)}`;

    const totalCost = events.reduce((sum, event) => {
      let eventCost = event.basePrice;
      if (event.offers && this.#offersModel) {
        event.offers.forEach((offerId) => {
          const offer = this.#offersModel.getById(offerId);
          if (offer) {
            eventCost += offer.price;
          }
        });
      }
      return sum + eventCost;
    }, 0);

    this.#infoComponent = new InfoView(title, dateString, totalCost);
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const tripControls = tripMain.querySelector('.trip-main__trip-controls');
      if (tripControls) {
        tripMain.insertBefore(this.#infoComponent.element, tripControls);
      } else {
        render(this.#infoComponent, tripMain);
      }
    }
  }

  #renderFilters() {
    this.#filtersComponent = new FiltersView('everything');
    if (this.#filtersContainer) {
      render(this.#filtersComponent, this.#filtersContainer);
    }
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView('day');
    render(this.#sortingComponent, this.#eventsContainer);
  }

  #renderEvents() {
    const fullEvents = this.#eventsModel.getAllFullEvents();
    const sortedEvents = [...fullEvents].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    sortedEvents.forEach((event) => {
      this.#renderEvent(event);
    });
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      event,
      this.#offersModel,
      this.#destinationsModel
    );

    eventPresenter.init(this.#eventsContainer, (updatedEvent) => {
      this.#handleEventChange(updatedEvent);
    });

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleEventChange(updatedEvent) {
    this.#eventsModel.updateEvent(updatedEvent);

    this.#infoComponent?.removeElement();
    this.#renderInfo();

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (presenter) {
      presenter.destroy();
      this.#eventPresenters.delete(updatedEvent.id);
      this.#renderEvent(updatedEvent);
    }
  }
}
