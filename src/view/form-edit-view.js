import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EVENT_TYPES } from '../const.js';

function generateOffersForType(type) {
  const defaultOffers = {
    taxi: ['Baby seat', 'Pet transportation', 'Wait driver', 'Air conditioning'],
    bus: ['Wi-Fi', 'USB charger', 'Extra luggage', 'Refreshments'],
    train: ['Meal', 'Bedding', 'Business class', 'First class'],
    ship: ['Cabin with window', 'All inclusive', 'Breakfast', 'Sun deck access'],
    drive: ['Car with conditioner', 'GPS navigation', 'Child seat', 'Full insurance'],
    flight: ['Add luggage', 'Business class', 'Preference meal', 'Insurance', 'Seat selection'],
    'check-in': ['Late checkout', 'Breakfast', 'Early check-in', 'Room with a view'],
    sightseeing: ['Guide', 'Audio guide', 'Skip the line', 'Transport included'],
    restaurant: ['Reservation', 'VIP zone', 'Sommelier', 'Chef\'s table']
  };

  const titles = defaultOffers[type] || ['Standard offer'];
  return titles.map((title, index) => ({
    id: `${type}-${index + 1}`,
    title: title,
    price: Math.floor(Math.random() * 100) + 10
  }));
}

function createFormEditTemplate(state, allDestinations) {
  const {
    type = EVENT_TYPES[0],
    destinationId = null,
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0,
    offers = [],
    id = null,
  } = state;

  let selectedDestination = allDestinations.find((d) => d.id === destinationId);
  if (!selectedDestination && state.destination) {
    selectedDestination = allDestinations.find((d) => d.name === state.destination.name) || state.destination;
  }
  if (!selectedDestination) {
    selectedDestination = { name: '', description: '', pictures: [] };
  }

  const resetButtonText = id ? 'Delete' : 'Cancel';

  const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const dateTimeFrom = formatDateTime(dateFrom);
  const dateTimeTo = formatDateTime(dateTo);

  const eventTypesTemplate = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1"
             class="event__type-input visually-hidden"
             type="radio"
             name="event-type"
             value="${eventType}"
             data-event-type="${eventType}"
             ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType}"
             for="event-type-${eventType}-1">
        ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}
      </label>
    </div>
  `).join('');

  const destinationsListTemplate = allDestinations.map((dest) => `
    <option value="${dest.name}" data-destination-id="${dest.id}"></option>
  `).join('');

  const currentOffers = offers.length > 0 ? offers : generateOffersForType(type);

  const offersTemplate = currentOffers.length > 0 ? `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${currentOffers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden"
                   id="event-offer-${offer.id}"
                   type="checkbox"
                   name="event-offer-${offer.id}"
                   value="${offer.id}"
                   data-offer-id="${offer.id}"
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

  const picturesTemplate = selectedDestination.pictures && selectedDestination.pictures.length > 0 ? `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${selectedDestination.pictures.map((pic) => pic && pic.src ? `
          <img class="event__photo" src="${pic.src}" alt="${pic.description || ''}">
        ` : '').join('')}
      </div>
    </div>
  ` : '';

  const destinationDescriptionTemplate = selectedDestination.description ? `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${selectedDestination.description}</p>
      ${picturesTemplate}
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
                   value="${selectedDestination.name || ''}"
                   list="destination-list-1"
                   autocomplete="off"
                   required>
            <datalist id="destination-list-1">
              ${destinationsListTemplate}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time"
                   id="event-start-time-1"
                   type="datetime-local"
                   name="event-start-time"
                   value="${dateTimeFrom}"
                   required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-1"
                   type="datetime-local"
                   name="event-end-time"
                   value="${dateTimeTo}"
                   required>
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

export default class FormEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleResetClick = null;
  #handleRollupClick = null;
  #allDestinations = [];

  constructor({ point, allDestinations, onFormSubmit, onResetClick, onRollupClick }) {
    super();
    this.#allDestinations = allDestinations || [];

    let destinationId = null;
    if (point.destination) {
      const foundDest = this.#allDestinations.find((d) => d.name === point.destination.name);
      if (foundDest) {
        destinationId = foundDest.id;
      }
    }

    const initialState = {
      ...point,
      destinationId: destinationId
    };
    this._setState(initialState);

    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;
    this.#handleRollupClick = onRollupClick;
    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state, this.#allDestinations);
  }

  _restoreHandlers() {
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

    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
  }

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;
    const newOffers = generateOffersForType(newType);
    const newState = {
      ...this._state,
      type: newType,
      offers: newOffers
    };
    this.updateElement(newState);
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value;
    const selectedDestination = this.#allDestinations.find((d) => d.name === destinationName);

    if (selectedDestination) {
      const newState = {
        ...this._state,
        destinationId: selectedDestination.id
      };
      this.updateElement(newState);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#allDestinations.find((d) => d.id === this._state.destinationId);
    const submitState = {
      ...this._state,
      destination: destination || { name: '', description: '', pictures: [] }
    };
    delete submitState.destinationId;
    this.#handleFormSubmit(submitState);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };
}
