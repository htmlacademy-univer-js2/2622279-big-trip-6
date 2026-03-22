import AbstractView from '../framework/view/abstract-view.js';
import { EVENT_TYPES } from '../const.js';

function createFormEditTemplate(point) {
  const {
    type = EVENT_TYPES[0],
    destination = { name: '', description: '', pictures: [] },
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0,
    offers = [],
    id = null,
  } = point;

  const resetButtonText = id ? 'Delete' : 'Cancel';

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const dateFormatted = formatDate(dateFrom);
  const timeFrom = formatTime(dateFrom);
  const timeTo = formatTime(dateTo);

  const eventTypesTemplate = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1"
             class="event__type-input visually-hidden"
             type="radio"
             name="event-type"
             value="${eventType}"
             ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType}"
             for="event-type-${eventType}-1">
        ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}
      </label>
    </div>
  `).join('');

  const offersTemplate = offers.length > 0 ? `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden"
                   id="event-offer-${offer.id}"
                   type="checkbox"
                   name="event-offer-${offer.id}"
                   value="${offer.id}"
                   checked>
            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '<p class="event__offers-message">No offers available for this event type</p>';

  const destinationDescriptionTemplate = destination.description ? `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${destination.pictures?.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination.pictures.map((pic) => `
              <img class="event__photo" src="${pic.src}" alt="${pic.description}">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  ` : '';

  return `
    <div class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
            <input class="event__input event__input--destination"
                   id="event-destination-1"
                   type="text"
                   name="event-destination"
                   value="${destination.name}"
                   list="destination-list-1"
                   required>
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="Paris"></option>
              <option value="Rome"></option>
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time"
                   id="event-start-time-1"
                   type="text"
                   name="event-start-time"
                   value="${dateFormatted} ${timeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-1"
                   type="text"
                   name="event-end-time"
                   value="${dateFormatted} ${timeTo}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price"
                   id="event-price-1"
                   type="number"
                   name="event-price"
                   value="${basePrice}"
                   min="0"
                   required>
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonText}</button>
          ${id ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationDescriptionTemplate}
        </section>
      </form>
    </div>
  `;
}

export default class FormEditView extends AbstractView {
  #point = null;
  #handleFormSubmit = null;
  #handleResetClick = null;
  #handleRollupClick = null;
  #handleTypeChange = null;

  constructor({ point, onFormSubmit, onResetClick, onRollupClick, onTypeChange }) {
    super();
    this.#point = point;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;
    this.#handleRollupClick = onRollupClick;
    this.#handleTypeChange = onTypeChange;

    const form = this.element.querySelector('form');
    if (form) {
      form.addEventListener('submit', this.#formSubmitHandler);
    }

    const resetBtn = this.element.querySelector('.event__reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', this.#resetClickHandler);
    }

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#rollupClickHandler);
    }

    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
  }

  get template() {
    return createFormEditTemplate(this.#point);
  }

  getPoint() {
    return this.#point;
  }

  getFormData() {
    const form = this.element.querySelector('form');
    const formData = new FormData(form);

    const type = formData.get('event-type');
    const destinationName = formData.get('event-destination');
    const startDateTime = formData.get('event-start-time');
    const endDateTime = formData.get('event-end-time');
    const price = parseInt(formData.get('event-price'), 10);

    const selectedOffers = [];
    this.element.querySelectorAll('.event__offer-checkbox:checked').forEach((checkbox) => {
      const offerId = checkbox.value;
      const offer = this.#point.offers?.find((o) => o.id === offerId);
      if (offer) {
        selectedOffers.push(offer);
      }
    });

    return {
      type,
      destinationName,
      startDateTime,
      endDateTime,
      price,
      offers: selectedOffers
    };
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const formData = this.getFormData();
    this.#handleFormSubmit(formData);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;
    this.#handleTypeChange?.(newType);
  };
}
