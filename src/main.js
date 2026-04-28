import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

if (filtersContainer && eventsContainer) {
  const eventsModel = new EventsModel();
  const filterModel = new FilterModel();

  const filterPresenter = new FilterPresenter({
    container: filtersContainer,
    filterModel: filterModel,
    eventsModel: eventsModel
  });

  const pagePresenter = new PagePresenter({
    eventsContainer: eventsContainer,
    eventsModel: eventsModel,
    filterModel: filterModel
  });

  filterPresenter.init();
  pagePresenter.init();
}
