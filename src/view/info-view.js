import AbstractView from '../framework/view/abstract-view.js';

function createInfoTemplate({ title, dates, cost }) {
  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>
  `;
}

export default class InfoView extends AbstractView {
  #title = null;
  #dates = null;
  #cost = 0;

  constructor(title, dates, cost) {
    super();
    this.#title = title;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    return createInfoTemplate({
      title: this.#title,
      dates: this.#dates,
      cost: this.#cost
    });
  }
}
