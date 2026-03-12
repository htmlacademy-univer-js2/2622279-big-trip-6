import {createElement} from '../render.js';

function createPointTemplate(event, destination, offers) {
  const {type, dateFrom, dateTo, basePrice, isFavorite} = event;
  const destinationName = destination ? destination.name : '';

  const date = new Date(dateFrom);
  const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  const timeFrom = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeTo = new Date(dateTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const diffMs = new Date(dateTo) - new Date(dateFrom);
  const diffMins = Math.floor(diffMs / 60000);
  let duration = '';

  if (diffMins < 60) {
    duration = `${diffMins}M`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    duration = `${hours.toString().padStart(2, '0')}H ${mins.toString().padStart(2, '0')}M`;
  } else {
    const days = Math.floor(diffMins / 1440);
    const hours = Math.floor((diffMins % 1440) / 60);
    const mins = diffMins % 60;
    duration = `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${mins.toString().padStart(2, '0')}M`;
  }

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const eventTitle = destinationName
    ? `${type} to ${destinationName}`
    : type;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${month} ${day}</time>
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
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers.slice(0, 3).map((offer) => `
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              +€&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>
          `).join('')}
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
    </li>`
  );
}

export default class RoutePointView {
  constructor(event, destination, offers) {
    this.event = event;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createPointTemplate(this.event, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
