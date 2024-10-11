class ViewValidator {
  /**
   * Check if a DOM element exists and log an error if not.
   * @param {HTMLElement} element - The DOM element to check.
   * @param {string} selector - The CSS selector used to query the element.
   */
  checkElementExists(element, selector) {
    if (!element) {
      console.error(`Element not found for selector: ${selector}`);
    }
  }
}

export default new ViewValidator();
