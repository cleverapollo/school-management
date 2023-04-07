import dayjs from 'dayjs';
import { isNaN } from 'lodash';

export type ValidationType = keyof typeof validations;

export class ValidationError extends Error {
  type: ValidationType;

  constructor(type: ValidationType, message?: string) {
    super(message);
    this.type = type;
  }
}

export const validations = {
  required: <T>(value: T, errorMessage?: string): T | ValidationError => {
    if (
      (Array.isArray(value) && value.length === 0) ||
      value === undefined ||
      value === null ||
      value === ''
    ) {
      throw new ValidationError('required', errorMessage);
    }

    return value;
  },
  date: (date: Date, errorMessage?: string): Date | ValidationError => {
    if (!dayjs(date).isValid()) {
      throw new ValidationError('date', errorMessage);
    }

    return date;
  },
  afterStartDate: (
    date: Date,
    startDate: Date,
    errorMessage?: string
  ): Date | ValidationError => {
    if (!dayjs(date).isAfter(startDate)) {
      throw new ValidationError('afterStartDate', errorMessage);
    }

    return date;
  },
  minLength: <T extends string | number | Array<any>>(
    value: T,
    length: number,
    errorMessage?: string
  ): T | ValidationError => {
    const asNumber = Number(value);

    if (
      (!isNaN(asNumber) && asNumber < length) ||
      (typeof value !== 'number' && value.length < length)
    ) {
      throw new ValidationError('minLength', errorMessage);
    }

    return value;
  },
  maxLength: <T extends string | number | Array<any>>(
    value: T,
    length: number,
    errorMessage?: string
  ): T | ValidationError => {
    const asNumber = Number(value);

    if (
      (!isNaN(asNumber) && asNumber > length) ||
      (typeof value !== 'number' && value.length > length)
    ) {
      throw new ValidationError('maxLength', errorMessage);
    }

    return value;
  },
};
