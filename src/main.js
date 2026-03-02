import Presenter from './presenter/presenter.js';
import EventsModel from './models/events-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

if (filtersContainer && eventsContainer) {
  const eventsModel = new EventsModel();
  const presenter = new Presenter({
    filtersContainer: filtersContainer,
    eventsContainer: eventsContainer,
    eventsModel: eventsModel
  });

  presenter.init();
}
