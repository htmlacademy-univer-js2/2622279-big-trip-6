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
    this.#renderPoint();
  }

  #getFullOffers(eventType, selectedOfferIds) {
    const offersByType = this.#offers[eventType] || [];
    return offersByType.filter((offer) => selectedOfferIds.includes(offer.id));
  }

  #renderPoint() {
    const destination = this.#destinations?.find((d) => d.id === this.#point.destination) || { name: '', description: '', pictures: [] };
    const pointOffers = this.#getFullOffers(this.#point.type, this.#point.offers || []);

    if (this.#pointComponent) {
      remove(this.#pointComponent);
    }

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      destination: destination,
      offers: pointOffers,
      onRollupClick: () => this.#handleEditClick(),
      onFavoriteClick: () => this.#handleFavoriteClick()
    });

    render(this.#pointComponent, this.#eventsContainer);
    this.#mode = Mode.DEFAULT;
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

  destroyEditForm() {
    if (this.#editComponent) {
      try {
        const destination = this.#destinations?.find((d) => d.id === this.#point.destination) || { name: '', description: '', pictures: [] };
        const pointOffers = this.#getFullOffers(this.#point.type, this.#point.offers || []);

        const newPointComponent = new RoutePointView({
          point: this.#point,
          destination: destination,
          offers: pointOffers,
          onRollupClick: () => this.#handleEditClick(),
          onFavoriteClick: () => this.#handleFavoriteClick()
        });

        replace(newPointComponent, this.#editComponent);
        this.#pointComponent = newPointComponent;
      } catch (err) {
        if (this.#editComponent.element && this.#editComponent.element.parentNode) {
          remove(this.#editComponent);
        }
      } finally {
        this.#editComponent = null;
      }
      this.#mode = Mode.DEFAULT;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #closeEditFormWithoutSave() {
    if (this.#editComponent) {
      try {
        const destination = this.#destinations?.find((d) => d.id === this.#point.destination) || { name: '', description: '', pictures: [] };
        const pointOffers = this.#getFullOffers(this.#point.type, this.#point.offers || []);

        const newPointComponent = new RoutePointView({
          point: this.#point,
          destination: destination,
          offers: pointOffers,
          onRollupClick: () => this.#handleEditClick(),
          onFavoriteClick: () => this.#handleFavoriteClick()
        });

        replace(newPointComponent, this.#editComponent);
        this.#pointComponent = newPointComponent;
        this.#editComponent = null;
        this.#mode = Mode.DEFAULT;
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      } catch (err) {
        this.#editComponent = null;
      }
    }
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.destroyEditForm();
    }
  }

  #openEditForm() {
    this.#handleModeChange();

    setTimeout(() => {
      if (this.#editComponent) {
        return;
      }

      if (!this.#pointComponent || !this.#pointComponent.element) {
        return;
      }

      this.#editComponent = new FormEditView({
        point: this.#point,
        destinations: this.#destinations,
        offers: this.#offers,
        onFormSubmit: (point) => this.#handleFormSubmit(point),
        onResetClick: () => this.#handleDeleteClick(),
        onRollupClick: () => this.#closeEditFormWithoutSave()
      });

      try {
        replace(this.#editComponent, this.#pointComponent);
        this.#mode = Mode.EDITING;
        document.addEventListener('keydown', this.#escKeyDownHandler);
      } catch (err) {
        this.#editComponent = null;
      }
    }, 50);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeEditFormWithoutSave();
    }
  };

  #handleEditClick = () => {
    this.#handleModeChange();
    setTimeout(() => {
      if (this.#editComponent) {
        return;
      }
      this.#openEditForm();
    }, 50);
  };

  #handleDeleteClick = async () => {
    if (this.#point.id) {
      this.#editComponent?.setDeleting(true);
      try {
        await this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MAJOR, this.#point);
      } catch {
        this.#editComponent?.shake();
        this.#editComponent?.setDeleting(false);
      }
    } else {
      this.#closeEditFormWithoutSave();
    }
  };

  #handleFavoriteClick = async () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };

    const favBtn = this.#pointComponent?.element.querySelector('.event__favorite-btn');
    if (favBtn) {
      favBtn.classList.toggle('event__favorite-btn--active');
      favBtn.disabled = true;
    }

    try {
      await this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
      this.#point = updatedPoint;
    } catch {
      if (favBtn) {
        favBtn.classList.toggle('event__favorite-btn--active');
      }
      this.#pointComponent?.shake();
    } finally {
      if (favBtn) {
        favBtn.disabled = false;
      }
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

        const destination = this.#destinations?.find((d) => d.id === this.#point.destination) || { name: '', description: '', pictures: [] };
        const pointOffers = this.#getFullOffers(this.#point.type, this.#point.offers || []);

        const newPointComponent = new RoutePointView({
          point: this.#point,
          destination: destination,
          offers: pointOffers,
          onRollupClick: () => this.#handleEditClick(),
          onFavoriteClick: () => this.#handleFavoriteClick()
        });

        if (this.#editComponent && this.#editComponent.element && this.#editComponent.element.parentNode) {
          replace(newPointComponent, this.#editComponent);
        }
        this.#pointComponent = newPointComponent;
        this.#editComponent = null;
        this.#mode = Mode.DEFAULT;
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      } else {
        await this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, pointForSubmit);
        this.destroy();
        return;
      }
    } catch {
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
