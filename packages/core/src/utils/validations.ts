import dayjs from 'dayjs';

export type ValidationType = keyof typeof validations | 'validate';

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
  date: (
    date: Date | dayjs.Dayjs,
    errorMessage?: string
  ): Date | dayjs.Dayjs | ValidationError => {
    if (!dayjs(date).isValid()) {
      throw new ValidationError('date', errorMessage);
    }

    return date;
  },
  afterStartDate: (
    date: Date | dayjs.Dayjs,
    startDate: Date | dayjs.Dayjs,
    errorMessage?: string
  ): Date | dayjs.Dayjs | ValidationError => {
    if (!dayjs(date).isAfter(startDate)) {
      throw new ValidationError('afterStartDate', errorMessage);
    }

    return date;
  },
  min: <T extends string | number>(
    value: T,
    length: number,
    errorMessage?: string
  ): T | ValidationError => {
    const asNumber = Number(value);

    if (!Number.isNaN(asNumber) && asNumber < length) {
      throw new ValidationError('min', errorMessage);
    }

    return value;
  },
  max: <T extends string | number>(
    value: T,
    length: number,
    errorMessage?: string
  ): T | ValidationError => {
    const asNumber = Number(value);

    if (!Number.isNaN(asNumber) && asNumber > length) {
      throw new ValidationError('max', errorMessage);
    }

    return value;
  },
  minLength: <T extends string | Array<any>>(
    value: T,
    length: number,
    errorMessage?: string
  ): T | ValidationError => {
    if (value.length < length) {
      throw new ValidationError('minLength', errorMessage);
    }

    return value;
  },
  maxLength: <T extends string | Array<any>>(
    value: T,
    length: number,
    errorMessage?: string
  ): T | ValidationError => {
    if (value.length > length) {
      throw new ValidationError('maxLength', errorMessage);
    }

    return value;
  },
  isEmail: <T extends string>(
    value: T,
    errorMessage?: string
  ): T | ValidationError => {
    // NOTE: matcher was taken from https://github.com/segmentio/is-email
    const matcher =
      // eslint-disable-next-line no-useless-escape
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (value && !matcher.test(value)) {
      throw new ValidationError('isEmail', errorMessage);
    }

    return value;
  },
  isPhoneNumber: <
    T extends string | { number: string; numberMatchWithMask: boolean }
  >(
    value: T,
    errorMessage?: string
  ): T | ValidationError => {
    const simpleMatch = /[A-Z]/gi;

    if (value && typeof value === 'string' && simpleMatch.test(value)) {
      throw new ValidationError('isPhoneNumber', errorMessage);
    }

    if (
      typeof value === 'object' &&
      value.number &&
      'numberMatchWithMask' in value &&
      !value.numberMatchWithMask
    ) {
      throw new ValidationError('isPhoneNumber', errorMessage);
    }

    return value;
  },
};
