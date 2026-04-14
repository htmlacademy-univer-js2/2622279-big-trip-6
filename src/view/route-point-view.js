import AbstractView from '../framework/view/abstract-view.js';

function createPointTemplate(point, destination, offers) {
  if (!point) {
    return '';
  }

  const { type, dateFrom, dateTo, basePrice, isFavorite } = point;
  const destinationName = destination ? destination.name : '';

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return `${month} ${day}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formattedDate = formatDate(dateFrom);
  const timeFrom = formatTime(dateFrom);
  const timeTo = formatTime(dateTo);

  const duration = new Date(dateTo) - new Date(dateFrom);
  const diffMins = Math.floor(duration / 60000);
  let durationFormatted = '';

  if (diffMins < 60) {
    durationFormatted = `${diffMins}M`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    durationFormatted = `${hours.toString().padStart(2, '0')}H ${mins.toString().padStart(2, '0')}M`;
  } else {
    const days = Math.floor(diffMins / 1440);
    const hours = Math.floor((diffMins % 1440) / 60);
    const mins = diffMins % 60;
    durationFormatted = `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${mins.toString().padStart(2, '0')}M`;
  }

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const eventTitle = destinationName ? `${type} to ${destinationName}` : type;

  const offersTemplate = offers && offers.length > 0 ? offers.slice(0, 3).map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      +€&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('') : '';

  return `
    <div class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${formattedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${durationFormatted}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </div>
  `;
}

export default class RoutePointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #onRollupClick = null;
  #onFavoriteClick = null;

  constructor({ point, destination, offers, onRollupClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#onRollupClick = onRollupClick;
    this.#onFavoriteClick = onFavoriteClick;

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#rollupClickHandler);
    }

    const favoriteBtn = this.element.querySelector('.event__favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', this.#favoriteClickHandler);
    }
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
