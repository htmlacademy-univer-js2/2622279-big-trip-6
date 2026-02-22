import Presenter from './presenter/presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const presenter = new Presenter({
  filtersContainer: filtersContainer,
  eventsContainer: eventsContainer
});

presenter.init();
