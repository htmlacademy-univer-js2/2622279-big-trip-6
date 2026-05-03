import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #eventsContainer = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #point = null;
  #pointComponent = null;
  #editComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ eventsContainer, destinations, offers, onDataChange, onModeChange }) {
    this.#eventsContainer = eventsContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#renderEvent();
  }

  #getFullOffers(eventType, selectedOfferIds) {
    const offersByType = this.#offers[eventType] || [];
    return offersByType.filter((offer) => selectedOfferIds.includes(offer.id));
  }

  #renderEvent() {
    if (this.#mode === Mode.EDITING) {
      this.#renderEditForm();
    } else {
      this.#renderPoint();
    }
  }

  #renderPoint() {
    const destination = this.#destinations?.find((d) => d.id === this.#point.destination) || { name: '', description: '', pictures: [] };
    const pointOffers = this.#getFullOffers(this.#point.type, this.#point.offers || []);

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      destination: destination,
      offers: pointOffers,
      onRollupClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (prevEditComponent) {
      remove(prevEditComponent);
      this.#editComponent = null;
    }

    if (prevPointComponent) {
      replace(this.#pointComponent, prevPointComponent);
    } else {
      render(this.#pointComponent, this.#eventsContainer);
    }

    this.#mode = Mode.DEFAULT;
  }

  #renderEditForm() {
    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    this.#editComponent = new FormEditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleResetClick,
      onRollupClick: this.#handleCloseClick
    });

    if (prevPointComponent) {
      replace(this.#editComponent, prevPointComponent);
      this.#pointComponent = null;
    } else if (prevEditComponent) {
      replace(this.#editComponent, prevEditComponent);
    } else {
      render(this.#editComponent, this.#eventsContainer);
    }

    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointComponent) {
      remove(this.#pointComponent);
      this.#pointComponent = null;
    }
    if (this.#editComponent) {
      remove(this.#editComponent);
      this.#editComponent = null;
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToPoint();
    }
  }

  #replaceEditToPoint() {
    if (!this.#pointComponent || !this.#editComponent) {
      if (this.#editComponent) {
        remove(this.#editComponent);
        this.#editComponent = null;
      }
      this.#renderPoint();
      return;
    }

    replace(this.#pointComponent, this.#editComponent);
    this.#editComponent = null;
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replacePointToEdit() {
    if (!this.#editComponent || !this.#pointComponent) {
      this.#renderEditForm();
      return;
    }

    replace(this.#editComponent, this.#pointComponent);
    this.#pointComponent = null;
    this.#mode = Mode.EDITING;
    this.#handleModeChange();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEdit();
  };

  #handleCloseClick = () => {
    this.#replaceEditToPoint();
  };

  #handleResetClick = async () => {
    if (this.#point.id) {
      this.#editComponent?.setDeleting(true);
      try {
        await this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MAJOR, this.#point);
      } catch (error) {
        this.#editComponent?.shake();
        this.#editComponent?.setDeleting(false);
      }
    } else {
      this.#replaceEditToPoint();
    }
  };

  #handleFavoriteClick = async () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };
    try {
      await this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
      this.#point = updatedPoint;
      if (this.#pointComponent) {
        const destination = this.#destinations?.find((d) => d.id === this.#point.destination) || { name: '', description: '', pictures: [] };
        const pointOffers = this.#getFullOffers(this.#point.type, this.#point.offers || []);

        const newPointComponent = new RoutePointView({
          point: this.#point,
          destination: destination,
          offers: pointOffers,
          onRollupClick: this.#handleEditClick,
          onFavoriteClick: this.#handleFavoriteClick
        });

        if (this.#pointComponent) {
          replace(newPointComponent, this.#pointComponent);
        }
        this.#pointComponent = newPointComponent;
      }
    } catch (error) {
      // Обработка ошибки
    }
  };

  #handleFormSubmit = async (updatedPoint) => {
    if (!this.#isValid(updatedPoint)) {
      this.#editComponent?.shake();
      return;
    }

    this.#editComponent?.setSaving(true);

    try {
      const pointForSubmit = {
        ...updatedPoint,
        destination: updatedPoint.destination.id || updatedPoint.destination
      };

      if (this.#point.id) {
        await this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MAJOR, pointForSubmit);
        this.#point = updatedPoint;
      } else {
        await this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, pointForSubmit);
        this.destroy();
        return;
      }

      this.#replaceEditToPoint();
    } catch (error) {
      this.#editComponent?.shake();
    } finally {
      this.#editComponent?.setSaving(false);
    }
  };

  #isValid(point) {
    if (!point.type) {
      return false;
    }

    if (!point.destination || !point.destination.id) {
      return false;
    }

    if (!point.dateFrom || !point.dateTo) {
      return false;
    }

    if (dayjs(point.dateTo).isBefore(dayjs(point.dateFrom))) {
      return false;
    }

    if (point.basePrice < 0 || isNaN(point.basePrice)) {
      return false;
    }

    return true;
  }
}
