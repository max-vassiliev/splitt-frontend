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

export const isIntegerOrNull = value =>
  value === null || Number.isInteger(value);
