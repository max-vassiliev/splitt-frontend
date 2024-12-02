/**
 * Creates a debounced function that delays the invocation of the provided function.
 *
 * @param {Function} functionToDebounce - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A new debounced function.
 */
export const debounce = (functionToDebounce, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => functionToDebounce.apply(this, args), delay);
  };
};
