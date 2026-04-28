import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EVENT_TYPES } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { destinationsMock } from '../mock/destinations-mock.js';

function generateOffersForType(type) {
  const offersData = {
    taxi: [
      { id: 'taxi-1', title: 'Baby seat', price: 15 },
      { id: 'taxi-2', title: 'Pet transportation', price: 25 },
      { id: 'taxi-3', title: 'Wait driver', price: 20 },
      { id: 'taxi-4', title: 'Air conditioning', price: 10 }
    ],
    flight: [
      { id: 'flight-1', title: 'Add luggage', price: 30 },
      { id: 'flight-2', title: 'Business class', price: 150 },
      { id: 'flight-3', title: 'Preference meal', price: 25 },
      { id: 'flight-4', title: 'Seat selection', price: 15 }
    ],
    train: [
      { id: 'train-1', title: 'Meal', price: 20 },
      { id: 'train-2', title: 'Bedding', price: 15 },
      { id: 'train-3', title: 'First class', price: 80 }
    ],
    bus: [
      { id: 'bus-1', title: 'Wi-Fi', price: 5 },
      { id: 'bus-2', title: 'USB charger', price: 8 },
      { id: 'bus-3', title: 'Extra luggage', price: 15 }
    ],
    'check-in': [
      { id: 'check-in-1', title: 'Late checkout', price: 30 },
      { id: 'check-in-2', title: 'Breakfast', price: 20 },
      { id: 'check-in-3', title: 'Early check-in', price: 25 }
    ],
    sightseeing: [
      { id: 'sightseeing-1', title: 'Guide', price: 25 },
      { id: 'sightseeing-2', title: 'Audio guide', price: 10 },
      { id: 'sightseeing-3', title: 'Skip the line', price: 15 }
    ],
    restaurant: [
      { id: 'restaurant-1', title: 'Reservation', price: 15 },
      { id: 'restaurant-2', title: 'VIP zone', price: 50 }
    ]
  };
  return offersData[type] || [];
}

function createFormEditTemplate(state) {
  const {
    type = EVENT_TYPES[0],
    destinationId = null,
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0,
    selectedOffers = [],
    id = null,
  } = state;

  const selectedDestination = destinationsMock.find((d) => d.id === destinationId) || { name: '', description: '', pictures: [] };
  const currentOffers = generateOffersForType(type);

  const resetButtonText = id ? 'Delete' : 'Cancel';

  const dateTimeFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const dateTimeTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const eventTypesTemplate = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-edit"
             class="event__type-input visually-hidden"
             type="radio"
             name="event-type"
             value="${eventType}"
             data-event-type="${eventType}"
             ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType}"
             for="event-type-${eventType}-edit">
        ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}
      </label>
    </div>
  `).join('');

  const destinationsListTemplate = destinationsMock.map((dest) => `
    <option value="${dest.name}" data-destination-id="${dest.id}"></option>
  `).join('');

  const offersTemplate = currentOffers.length > 0 ? `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${currentOffers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden"
                   id="event-offer-${offer.id}-edit"
                   type="checkbox"
                   name="event-offer-${offer.id}"
                   value="${offer.id}"
                   data-offer-id="${offer.id}"
                   ${selectedOffers.includes(offer.id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.id}-edit">
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
        ${selectedDestination.pictures.map((pic) => `
          <img class="event__photo" src="${pic.src}" alt="${pic.description}">
        `).join('')}
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
            <label class="event__type event__type-btn" for="event-type-toggle-edit">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-edit" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-edit">
              ${type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
            <input class="event__input event__input--destination"
                   id="event-destination-edit"
                   type="text"
                   name="event-destination"
                   value="${selectedDestination.name}"
                   list="destination-list-edit"
                   autocomplete="off"
                   required>
            <datalist id="destination-list-edit">
              ${destinationsListTemplate}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-edit">From</label>
            <input class="event__input event__input--time"
                   id="event-start-time-edit"
                   type="text"
                   name="event-start-time"
                   value="${dateTimeFrom}"
                   autocomplete="off"
                   required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-edit">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-edit"
                   type="text"
                   name="event-end-time"
                   value="${dateTimeTo}"
                   autocomplete="off"
                   required>
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-edit">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price"
                   id="event-price-edit"
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
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({ point, onFormSubmit, onResetClick, onRollupClick }) {
    super();
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;
    this.#handleRollupClick = onRollupClick;

    let destinationId = null;
    if (point.destination) {
      if (point.destination.id) {
        destinationId = point.destination.id;
      } else if (typeof point.destination === 'string') {
        destinationId = point.destination;
      } else if (point.destination.name) {
        const foundDest = destinationsMock.find((d) => d.name === point.destination.name);
        if (foundDest) {
          destinationId = foundDest.id;
        }
      }
    }

    const initialState = {
      id: point.id,
      type: point.type,
      destinationId: destinationId,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      basePrice: point.basePrice,
      selectedOffers: point.offers?.map((offer) => offer.id) || []
    };

    this._setState(initialState);
    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state);
  }

  removeElement() {
    super.removeElement();
    this.#destroyDatepickers();
  }

  reset(point) {
    let destinationId = null;
    if (point.destination) {
      if (point.destination.id) {
        destinationId = point.destination.id;
      } else if (typeof point.destination === 'string') {
        destinationId = point.destination;
      } else if (point.destination.name) {
        const foundDest = destinationsMock.find((d) => d.name === point.destination.name);
        if (foundDest) {
          destinationId = foundDest.id;
        }
      }
    }

    const newState = {
      id: point.id,
      type: point.type,
      destinationId: destinationId,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      basePrice: point.basePrice,
      selectedOffers: point.offers?.map((offer) => offer.id) || []
    };

    this.updateElement(newState);
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
      input.addEventListener('change', (evt) => {
        const newType = evt.target.value;
        const newState = {
          ...this._state,
          type: newType,
          selectedOffers: []
        };
        this.updateElement(newState);
      });
    });

    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', (evt) => {
        const destinationName = evt.target.value;
        const selectedDestination = destinationsMock.find((d) => d.name === destinationName);

        if (selectedDestination) {
          const newState = {
            ...this._state,
            destinationId: selectedDestination.id
          };
          this.updateElement(newState);
        }
      });
    }

    const offerCheckboxes = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (evt) => {
        const offerId = evt.target.value;
        const isChecked = evt.target.checked;

        let updatedOffers = [...(this._state.selectedOffers || [])];
        if (isChecked) {
          if (!updatedOffers.includes(offerId)) {
            updatedOffers.push(offerId);
          }
        } else {
          updatedOffers = updatedOffers.filter((id) => id !== offerId);
        }

        const newState = {
          ...this._state,
          selectedOffers: updatedOffers
        };
        this.updateElement(newState);
      });
    });

    const priceInput = this.element.querySelector('.event__input--price');
    if (priceInput) {
      priceInput.addEventListener('input', (evt) => {
        let value = evt.target.value.replace(/[^0-9]/g, '');
        if (value === '') {
          value = '0';
        }
        if (evt.target.value !== value) {
          evt.target.value = value;
        }
        this._setState({ ...this._state, basePrice: parseInt(value, 10) });
      });
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
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        defaultDate: dayjs(this._state.dateFrom).toDate(),
        onChange: ([userDate]) => {
          const newState = { ...this._state, dateFrom: userDate };
          if (this.#datepickerEnd && userDate) {
            this.#datepickerEnd.set('minDate', userDate);
          }
          this.updateElement(newState);
        },
        locale: { firstDayOfWeek: 1 }
      });
    }

    if (endDateInput) {
      this.#datepickerEnd = flatpickr(endDateInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        defaultDate: dayjs(this._state.dateTo).toDate(),
        onChange: ([userDate]) => {
          const newState = { ...this._state, dateTo: userDate };
          this.updateElement(newState);
        },
        minDate: dayjs(this._state.dateFrom).toDate(),
        locale: { firstDayOfWeek: 1 }
      });
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const destination = destinationsMock.find((d) => d.id === this._state.destinationId);
    const currentOffers = generateOffersForType(this._state.type);
    const selectedOffers = currentOffers.filter((offer) =>
      this._state.selectedOffers.includes(offer.id)
    );

    const updatedPoint = {
      id: this._state.id,
      type: this._state.type,
      destination: destination || { name: '', description: '', pictures: [] },
      dateFrom: this._state.dateFrom,
      dateTo: this._state.dateTo,
      basePrice: this._state.basePrice,
      offers: selectedOffers,
      isFavorite: false
    };

    this.#handleFormSubmit(updatedPoint);
  };

  #resetClickHandler = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.#handleResetClick();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };
}
