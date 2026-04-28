import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function createInfoTemplate(title, startDate, endDate, cost) {
  const formatDate = (date) => dayjs(date).format('MMM D');
  const dateString = `${formatDate(startDate)}&nbsp;&mdash;&nbsp;${formatDate(endDate)}`;

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
  #startDate = null;
  #endDate = null;
  #cost = 0;

  constructor(title, startDate, endDate, cost) {
    super();
    this.#title = title;
    this.#startDate = startDate;
    this.#endDate = endDate;
    this.#cost = cost;
  }

  get template() {
    return createInfoTemplate(this.#title, this.#startDate, this.#endDate, this.#cost);
  }
}
