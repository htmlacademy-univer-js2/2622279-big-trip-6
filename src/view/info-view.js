import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function createInfoTemplate({ title, dateFrom, dateTo, cost }) {
  const formatDate = (date) => dayjs(date).format('MMM D');
  const dateString = `${formatDate(dateFrom)}&nbsp;&mdash;&nbsp;${formatDate(dateTo)}`;

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${dateString}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>
  `;
}

export default class InfoView extends AbstractView {
  #title = null;
  #dateFrom = null;
  #dateTo = null;
  #cost = 0;

  constructor(title, dateFrom, dateTo, cost) {
    super();
    this.#title = title;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#cost = cost;
  }

  get template() {
    return createInfoTemplate({
      title: this.#title,
      dateFrom: this.#dateFrom,
      dateTo: this.#dateTo,
      cost: this.#cost
    });
  }
}
