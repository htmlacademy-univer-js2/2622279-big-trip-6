import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EVENT_TYPES } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function generateOffersForType(type) {
  const offersData = {
    taxi: [
      { id: 'taxi-1', title: 'Baby seat', price: 15 },
      { id: 'taxi-2', title: 'Pet transportation', price: 25 },
      { id: 'taxi-3', title: 'Wait driver', price: 20 },
      { id: 'taxi-4', title: 'Air conditioning', price: 10 }
    ],
    bus: [
      { id: 'bus-1', title: 'Wi-Fi', price: 5 },
      { id: 'bus-2', title: 'USB charger', price: 8 },
      { id: 'bus-3', title: 'Extra luggage', price: 15 },
      { id: 'bus-4', title: 'Refreshments', price: 12 }
    ],
    train: [
      { id: 'train-1', title: 'Meal', price: 20 },
      { id: 'train-2', title: 'Bedding', price: 15 },
      { id: 'train-3', title: 'Business class', price: 50 },
      { id: 'train-4', title: 'First class', price: 80 }
    ],
    ship: [
      { id: 'ship-1', title: 'Cabin with window', price: 40 },
      { id: 'ship-2', title: 'All inclusive', price: 100 },
      { id: 'ship-3', title: 'Breakfast', price: 25 },
      { id: 'ship-4', title: 'Sun deck access', price: 30 }
    ],
    drive: [
      { id: 'drive-1', title: 'Car with conditioner', price: 20 },
      { id: 'drive-2', title: 'GPS navigation', price: 15 },
      { id: 'drive-3', title: 'Child seat', price: 12 },
      { id: 'drive-4', title: 'Full insurance', price: 35 }
    ],
    flight: [
      { id: 'flight-1', title: 'Add luggage', price: 30 },
      { id: 'flight-2', title: 'Business class', price: 150 },
      { id: 'flight-3', title: 'Preference meal', price: 25 },
      { id: 'flight-4', title: 'Insurance', price: 20 },
      { id: 'flight-5', title: 'Seat selection', price: 15 }
    ],
    'check-in': [
      { id: 'check-in-1', title: 'Late checkout', price: 30 },
      { id: 'check-in-2', title: 'Breakfast', price: 20 },
      { id: 'check-in-3', title: 'Early check-in', price: 25 },
      { id: 'check-in-4', title: 'Room with a view', price: 40 }
    ],
    sightseeing: [
      { id: 'sightseeing-1', title: 'Guide', price: 25 },
      { id: 'sightseeing-2', title: 'Audio guide', price: 10 },
      { id: 'sightseeing-3', title: 'Skip the line', price: 15 },
      { id: 'sightseeing-4', title: 'Transport included', price: 20 }
    ],
    restaurant: [
      { id: 'restaurant-1', title: 'Reservation', price: 15 },
      { id: 'restaurant-2', title: 'VIP zone', price: 50 },
      { id: 'restaurant-3', title: 'Sommelier', price: 30 },
      { id: 'restaurant-4', title: 'Chef\'s table', price: 70 }
    ]
  };

  return offersData[type] || [];
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

  const dateTimeFrom = dayjs(dateFrom).format('YYYY-MM-DD HH:mm');
  const dateTimeTo = dayjs(dateTo).format('YYYY-MM-DD HH:mm');

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
                   ${offers.some((o) => o.id === offer.id) ? 'checked' : ''}>
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
                   type="text"
                   name="event-start-time"
                   value="${dateTimeFrom}"
                   autocomplete="off"
                   required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-1"
                   type="text"
                   name="event-end-time"
                   value="${dateTimeTo}"
                   autocomplete="off"
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
                   autocomplete="off"
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
  #datepickerStart = null;
  #datepickerEnd = null;

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

    this.#destroyDatepickers();
    this.#initDatepickers();
  }

  #destroyDatepickers() {
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  #initDatepickers() {
    const startDateInput = this.element.querySelector('input[name="event-start-time"]');
    const endDateInput = this.element.querySelector('input[name="event-end-time"]');

    if (startDateInput) {
      this.#datepickerStart = flatpickr(startDateInput, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        'time_24hr': true,
        defaultDate: dayjs(this._state.dateFrom).toDate(),
        onChange: this.#onDateFromChange,
        locale: {
          firstDayOfWeek: 1
        }
      });
    }

    if (endDateInput) {
      this.#datepickerEnd = flatpickr(endDateInput, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        'time_24hr': true,
        defaultDate: dayjs(this._state.dateTo).toDate(),
        onChange: this.#onDateToChange,
        minDate: dayjs(this._state.dateFrom).toDate(),
        locale: {
          firstDayOfWeek: 1
        }
      });
    }
  }

  #onDateFromChange = ([userDate]) => {
    const newState = {
      ...this._state,
      dateFrom: userDate
    };

    if (this.#datepickerEnd && userDate) {
      this.#datepickerEnd.set('minDate', userDate);
    }

    this.updateElement(newState);
  };

  #onDateToChange = ([userDate]) => {
    const newState = {
      ...this._state,
      dateTo: userDate
    };
    this.updateElement(newState);
  };

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
        destinationId: selectedDestination.id,
        destination: selectedDestination
      };
      this.updateElement(newState);
    } else if (destinationName === '') {
      const newState = {
        ...this._state,
        destinationId: null,
        destination: { name: '', description: '', pictures: [] }
      };
      this.updateElement(newState);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    let destination = null;
    if (this._state.destinationId) {
      destination = this.#allDestinations.find((d) => d.id === this._state.destinationId);
    }

    if (!destination && this._state.destination) {
      destination = this.#allDestinations.find((d) => d.name === this._state.destination.name);
    }

    if (!destination) {
      const destinationName = this.element.querySelector('.event__input--destination')?.value || '';
      destination = {
        id: null,
        name: destinationName,
        description: '',
        pictures: []
      };
    }

    const submitState = {
      ...this._state,
      destination: destination
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
