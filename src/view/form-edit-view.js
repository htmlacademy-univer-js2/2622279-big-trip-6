import AbstractView from '../framework/view/abstract-view.js';

function createFormEditTemplate(event, offers, destination) {
  const { type, dateFrom, dateTo, basePrice, id } = event;
  const destinationName = destination ? destination.name : '';
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

  const formattedStart = formatDateTime(dateFrom);
  const formattedEnd = formatDateTime(dateTo);


  const eventTypes = [
    'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
  ];

  const eventTypesTemplate = eventTypes.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1"
             class="event__type-input visually-hidden"
             type="radio"
             name="event-type"
             value="${eventType}"
             ${type === eventType ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType}"
             for="event-type-${eventType}-1">${eventType}</label>
    </div>
  `).join('');


  const offersTemplate = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${offer.id}-1"
             type="checkbox"
             name="event-offer-${offer.id}"
             ${event.offers?.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');


  const destinationsOptions = destination?.pictures?.map((picture) => `
    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
  `).join('') || '';


  const defaultOffers = `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">Add luggage</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">50</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
      <label class="event__offer-label" for="event-offer-comfort-1">
        <span class="event__offer-title">Switch to comfort</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">80</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
      <label class="event__offer-label" for="event-offer-meal-1">
        <span class="event__offer-title">Add meal</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">15</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
      <label class="event__offer-label" for="event-offer-seats-1">
        <span class="event__offer-title">Choose seats</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">5</span>
      </label>
    </div>
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
      <label class="event__offer-label" for="event-offer-train-1">
        <span class="event__offer-title">Travel by train</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">40</span>
      </label>
    </div>
  `;


  const defaultDestinations = `
    <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
    <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
    <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
    <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
    <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
  `;

  return (
    `<div class="trip-events__item">
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
              ${type}
            </label>
            <input class="event__input event__input--destination"
                   id="event-destination-1"
                   type="text"
                   name="event-destination"
                   value="${destinationName}"
                   list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time"
                   id="event-start-time-1"
                   type="text"
                   name="event-start-time"
                   value="${formattedStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-1"
                   type="text"
                   name="event-end-time"
                   value="${formattedEnd}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price"
                   id="event-price-1"
                   type="text"
                   name="event-price"
                   value="${basePrice}">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonText}</button>
          ${id ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
        </header>

        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offers.length ? offersTemplate : defaultOffers}
            </div>
          </section>

          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination?.description || 'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it\'s renowned for its skiing.'}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destinationsOptions || defaultDestinations}
              </div>
            </div>
          </section>
        </section>
      </form>
    </div>`
  );
}

export default class FormEditView extends AbstractView {
  #event = null;
  #offers = null;
  #destination = null;

  constructor(event, offers, destination, onSubmit, onReset, onRollup) {
    super();
    this.#event = event;
    this.#offers = offers;
    this.#destination = destination;

    const form = this.element.querySelector('form');
    if (form) {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        onSubmit();
      });
    }

    const resetBtn = this.element.querySelector('.event__reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        onReset();
      });
    }

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        onRollup();
      });
    }
  }

  get template() {
    return createFormEditTemplate(this.#event, this.#offers, this.#destination);
  }

  getEvent() {
    return this.#event;
  }
}
