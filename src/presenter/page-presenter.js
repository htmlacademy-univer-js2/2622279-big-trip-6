import { render, remove } from '../framework/render.js';
import SortingView from '../view/sort-view.js';
import InfoView from '../view/info-view.js';
import NoPointsView from '../view/no-points-view.js';
import LoadingView from '../view/loading-view.js';
import NewPointPresenter from './new-point-presenter.js';
import EventPresenter from './event-presenter.js';
import { SORT_TYPE, FilterType, UserAction, UpdateType } from '../const.js';
import { isPointFuture, isPointPresent, isPointPast } from '../utils.js';

export default class PagePresenter {
  #eventsContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #sortingComponent = null;
  #infoComponent = null;
  #noPointsComponent = null;
  #loadingComponent = null;
  #eventPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SORT_TYPE.DAY;
  #isLoading = true;

  constructor({ eventsContainer, eventsModel, filterModel }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelChange.bind(this));
    this.#filterModel.addObserver(this.#handleFilterChange.bind(this));
  }

  init() {
    this.#renderLoading();
    this.#eventsModel.init();
    this.#initNewEventButton();
  }

  #handleModelChange(updateType) {
    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
      remove(this.#loadingComponent);
      this.#renderSorting();
      this.#fullRefresh();
    } else if (updateType === UpdateType.ERROR) {
      this.#isLoading = false;
      remove(this.#loadingComponent);
      this.#renderNoPoints();
    } else if (updateType === UpdateType.MAJOR) {
      this.#fullRefresh();
    } else if (updateType === UpdateType.MINOR) {
      this.#updateEvents();
    }
  }

  #handleFilterChange() {
    this.#currentSortType = SORT_TYPE.DAY;

    if (this.#sortingComponent) {
      const radio = this.#sortingComponent.element.querySelector(`input[data-sort-type="${SORT_TYPE.DAY}"]`);
      if (radio) {
        radio.checked = true;
      }
    }

    this.#fullRefresh();
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderNoPoints() {
    const currentFilter = this.#filterModel.getFilter();
    this.#noPointsComponent = new NoPointsView(currentFilter);
    render(this.#noPointsComponent, this.#eventsContainer);
  }

  #initNewEventButton() {
    let newEventBtn = document.querySelector('.trip-main__event-add .btn');
    if (!newEventBtn) {
      newEventBtn = document.querySelector('.trip-main__event-add button');
    }
    if (!newEventBtn) {
      newEventBtn = document.querySelector('.btn--big');
    }
    if (newEventBtn) {
      const newBtn = newEventBtn.cloneNode(true);
      newEventBtn.parentNode.replaceChild(newBtn, newEventBtn);
      newBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.#newPointPresenter) {
          this.#handleNewPointClick();
        }
      });
    }
  }

  #handleNewPointClick() {
    if (this.#newPointPresenter) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SORT_TYPE.DAY;

    if (this.#sortingComponent) {
      const radio = this.#sortingComponent.element.querySelector(`input[data-sort-type="${SORT_TYPE.DAY}"]`);
      if (radio) {
        radio.checked = true;
      }
    }

    this.#resetAllEventViews();

    this.#newPointPresenter = new NewPointPresenter({
      eventsContainer: this.#eventsContainer,
      eventsModel: this.#eventsModel,
      onDataChange: this.#handleViewAction
    });
    this.#newPointPresenter.init(() => {
      this.#newPointPresenter = null;
    });
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_POINT:
        await this.#eventsModel.addEvent(updateType, update);
        if (this.#newPointPresenter) {
          this.#newPointPresenter.destroy();
          this.#newPointPresenter = null;
        }
        break;
      case UserAction.DELETE_POINT:
        await this.#eventsModel.deleteEvent(updateType, update.id);
        break;
    }
  };

  #getFilteredEvents() {
    const events = this.#eventsModel.getAllFullEvents();
    const currentFilter = this.#filterModel.getFilter();

    switch (currentFilter) {
      case FilterType.FUTURE:
        return events.filter((event) => isPointFuture(event));
      case FilterType.PRESENT:
        return events.filter((event) => isPointPresent(event));
      case FilterType.PAST:
        return events.filter((event) => isPointPast(event));
      default:
        return [...events];
    }
  }

  #getSortedEvents(events) {
    const sortedEvents = [...events];

    switch (this.#currentSortType) {
      case SORT_TYPE.DAY:
        return sortedEvents.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      case SORT_TYPE.TIME:
        return sortedEvents.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
      case SORT_TYPE.PRICE:
        return sortedEvents.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return sortedEvents;
    }
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #fullRefresh() {
    this.#clearEvents();
    this.#renderInfo();
    this.#renderEvents();
  }

  #updateEvents() {
    this.#clearEvents();
    this.#renderEvents();
  }

  #renderInfo() {
    const events = this.#getFilteredEvents();

    if (events.length === 0) {
      if (this.#infoComponent) {
        this.#infoComponent.removeElement();
        this.#infoComponent = null;
      }
      return;
    }

    if (this.#infoComponent) {
      this.#infoComponent.removeElement();
    }

    const sortedEvents = [...events].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];

    const destinations = this.#eventsModel.getDestinations();
    const firstDestination = destinations.find((d) => d.id === firstEvent.destination)?.name || '';
    const lastDestination = destinations.find((d) => d.id === lastEvent.destination)?.name || '';

    const title = `${firstDestination} &mdash; ${lastDestination}`;

    const startDate = new Date(firstEvent.dateFrom);
    const endDate = new Date(lastEvent.dateTo);

    const offers = this.#eventsModel.getOffers();
    const totalCost = events.reduce((sum, event) => {
      let eventCost = event.basePrice;
      if (event.offers && event.offers.length) {
        const typeOffers = offers[event.type] || [];
        event.offers.forEach((offerId) => {
          const offer = typeOffers.find((o) => o.id === offerId);
          if (offer) {
            eventCost += offer.price;
          }
        });
      }
      return sum + eventCost;
    }, 0);

    this.#infoComponent = new InfoView(title, startDate, endDate, totalCost);
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const tripControls = tripMain.querySelector('.trip-main__trip-controls');
      if (tripControls) {
        const existingInfo = tripMain.querySelector('.trip-main__trip-info');
        if (existingInfo) {
          existingInfo.remove();
        }
        tripMain.insertBefore(this.#infoComponent.element, tripControls);
      } else {
        render(this.#infoComponent, tripMain);
      }
    }
  }

  #renderSorting() {
    if (this.#sortingComponent) {
      return;
    }

    this.#sortingComponent = new SortingView({
      selectedSortType: this.#currentSortType,
      onSortTypeChange: (sortType) => this.#handleSortTypeChange(sortType)
    });
    render(this.#sortingComponent, this.#eventsContainer);
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#fullRefresh();
  }

  #renderEvents() {
    const filteredEvents = this.#getFilteredEvents();
    const sortedEvents = this.#getSortedEvents(filteredEvents);

    if (sortedEvents.length === 0) {
      this.#renderNoPoints();
      return;
    }

    if (this.#noPointsComponent) {
      this.#noPointsComponent.removeElement();
      this.#noPointsComponent = null;
    }

    sortedEvents.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsContainer: this.#eventsContainer,
      destinations: this.#eventsModel.getDestinations(),
      offers: this.#eventsModel.getOffers(),
      onDataChange: this.#handleViewAction.bind(this),
      onModeChange: () => this.#resetAllEventViews()
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #resetAllEventViews() {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
      this.#newPointPresenter = null;
    }
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  }
}
