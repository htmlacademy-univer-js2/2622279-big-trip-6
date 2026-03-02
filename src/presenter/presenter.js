import EventPointView from '../view/route-point-view.js';
import EventEditView from '../view/form-edit-view.js';
import SortingView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';

export default class Presenter {
  constructor({ filtersContainer, eventsContainer, eventsModel }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;

    this.eventViews = [];
  }

  init() {
    this.renderFilters();

    this.eventsContainer.innerHTML = '';
    this.eventViews = [];

    this.renderSorting();

    const events = this.eventsModel.getAllFullEvents();
    if (events.length > 0) {
      this.renderEditForm(events[0]);
    }

    this.renderEvents();
  }

  renderFilters() {
    const filtersView = new FiltersView();
    this.filtersContainer.innerHTML = '';
    this.filtersContainer.appendChild(filtersView.getElement());
  }

  renderSorting() {
    const sortingView = new SortingView();
    this.eventsContainer.appendChild(sortingView.getElement());
  }

  renderEvents() {
    const fullEvents = this.eventsModel.getAllFullEvents();

    const sortedEvents = [...fullEvents].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    sortedEvents.forEach((event) => {
      this.renderEvent(event);
    });
  }

  renderEvent(event) {
    const eventView = new EventPointView(
      event,
      event.destination,
      event.offers
    );

    this.addEventListeners(eventView, event);
    this.eventsContainer.appendChild(eventView.getElement());
    this.eventViews.push(eventView);
  }

  renderEditForm() {
    const editView = new EventEditView();
    this.eventsContainer.prepend(editView.getElement());
    this.addFormListeners(editView);
    this.eventViews.push(editView);
  }

  addEventListeners(eventView, event) {
    const element = eventView.getElement();
    const rollupBtn = element.querySelector('.event__rollup-btn');

    if (rollupBtn) {
      rollupBtn.addEventListener('click', () => {
        this.openEditForm(event);
      });
    }

    const favoriteBtn = element.querySelector('.event__favorite-btn');

    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        this.toggleFavorite(event);
      });
    }
  }

  addFormListeners(formView) {
    const element = formView.getElement();
    const form = element.querySelector('form');

    if (form) {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        this.handleFormSubmit();
      });

      const resetBtn = form.querySelector('.event__reset-btn');

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.handleFormReset(formView);
        });
      }

      const rollupBtn = form.querySelector('.event__rollup-btn');
      if (rollupBtn) {
        rollupBtn.addEventListener('click', () => {
          this.closeEditForm(formView);
        });
      }
    }
  }

  openEditForm(event) {
    const eventView = this.eventViews.find(
      (view) => view.event && view.event.id === event.id
    );

    if (eventView) {
      const editView = new EventEditView();
      const editElement = editView.getElement();

      eventView.getElement().replaceWith(editElement);

      const index = this.eventViews.indexOf(eventView);
      this.eventViews.splice(index, 1, editView);

      this.addFormListeners(editView);
    }
  }

  closeEditForm() {
    this.init();
  }

  toggleFavorite(event) {
    const updatedEvent = {
      ...event,
      isFavorite: !event.isFavorite
    };

    this.eventsModel.updateEvent(updatedEvent);
    this.updateEventInList(updatedEvent);
  }

  handleFormSubmit() {
    this.init();
  }

  handleFormReset(formView) {
    if (formView.event && formView.event.id) {
      this.eventsModel.deleteEvent(formView.event.id);
    }
    this.init();
  }

  updateEventInList(updatedEvent) {
    const eventView = this.eventViews.find(
      (view) => view.event && view.event.id === updatedEvent.id
    );

    if (eventView) {
      const fullEvent = this.eventsModel.getEventById(updatedEvent.id);
      const newEventView = new EventPointView(
        fullEvent,
        fullEvent.destination,
        fullEvent.offers
      );

      eventView.getElement().replaceWith(newEventView.getElement());
      const index = this.eventViews.indexOf(eventView);
      this.eventViews.splice(index, 1, newEventView);
      this.addEventListeners(newEventView, fullEvent);
    }
  }
}
