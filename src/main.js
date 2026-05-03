import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BigTripApi from './big-trip-api.js';

const AUTHORIZATION = 'Basic bigtrip123456';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

if (filtersContainer && eventsContainer) {
  const apiService = new BigTripApi(END_POINT, AUTHORIZATION);
  const eventsModel = new EventsModel(apiService);
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
