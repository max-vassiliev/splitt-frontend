import { ACTIVE_CLASS } from './Config.js';
import { TRANSACTION_TYPES } from './Config.js';

export const isEmptyString = str => str.trim() === '';

export const isNonEmptyString = value =>
  typeof value === 'string' && value.trim() !== '';

export const isNonEmptyStringOrNull = value =>
  value === null || (typeof value === 'string' && value.trim() !== '');

export const isNumericString = value => /^\d+$/.test(value);

export const isPositiveNumber = value =>
  (typeof value === 'number' && value > 0 && Number.isInteger(value)) ||
  (typeof value === 'bigint' && value > 0n);

export const isPositiveInteger = value =>
  typeof value === 'number' && value > 0 && Number.isInteger(value);

export const isNonNegativeInteger = value =>
  typeof value === 'number' && value >= 0 && Number.isInteger(value);

export const isIntegerOrNull = value =>
  value === null || Number.isInteger(value);

export const isActive = element => {
  return element.classList.contains(ACTIVE_CLASS);
};

export const validateTransactionType = type => {
  if (!TRANSACTION_TYPES.has(type)) {
    const validTypes = [...TRANSACTION_TYPES].join(', ');
    throw new Error(
      `Invalid transaction type: ${type} (${typeof type}). Expected one of the following types: ${validTypes}.`
    );
  }
};

export const validateDate = (inputDate, maxDate, minDate) => {
  const isDateWithinRange = inputDate >= minDate && inputDate <= maxDate;
  if (!isDateWithinRange) {
    throw new Error(`Invalid date: ${inputDate}`);
  }
};
