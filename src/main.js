import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

if (filtersContainer && eventsContainer) {
  const eventsModel = new EventsModel();

  const presenter = new PagePresenter({
    filtersContainer: filtersContainer,
    eventsContainer: eventsContainer,
    eventsModel: eventsModel
  });

  presenter.init();
}
