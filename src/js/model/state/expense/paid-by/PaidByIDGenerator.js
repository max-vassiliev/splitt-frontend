class PaidByIDGenerator {
  #nextEntryId;

  constructor() {
    this.#nextEntryId = 1;
  }

  /**
   * Generates a new unique entry ID.
   * @returns {number} The next sequential entry ID.
   */
  generateID = () => {
    return this.#nextEntryId++;
  };
}

export default new PaidByIDGenerator();
