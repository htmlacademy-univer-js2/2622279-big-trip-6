export default class FilterModel {
  #filters = null;

  constructor() {
    this.#filters = [
      { id: 'everything', name: 'Everything', disabled: false },
      { id: 'future', name: 'Future', disabled: false },
      { id: 'present', name: 'Present', disabled: false },
      { id: 'past', name: 'Past', disabled: false }
    ];
  }

  getFilters() {
    return this.#filters;
  }

  updateFilters(events) {
    const now = new Date();

    const hasFuture = events.some((event) => new Date(event.dateFrom) > now);
    const hasPresent = events.some((event) => {
      const start = new Date(event.dateFrom);
      const end = new Date(event.dateTo);
      return start <= now && end >= now;
    });
    const hasPast = events.some((event) => new Date(event.dateTo) < now);

    this.#filters = [
      { id: 'everything', name: 'Everything', disabled: false },
      { id: 'future', name: 'Future', disabled: !hasFuture },
      { id: 'present', name: 'Present', disabled: !hasPresent },
      { id: 'past', name: 'Past', disabled: !hasPast }
    ];

    return this.#filters;
  }
}
