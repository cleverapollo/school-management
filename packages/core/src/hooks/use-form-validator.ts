import { TFunction, useTranslation } from '@tyro/i18n';

import {
  FieldPath,
  FieldValues,
  Resolver,
  FieldErrors,
  FieldValue,
  ResolverOptions,
} from 'react-hook-form';
import { toNestErrors, validateFieldsNatively } from '@hookform/resolvers';
import {
  ValidationError,
  ValidationType,
  validations,
  flattenObject,
} from '../utils';

type ErrorMessages = Partial<Record<ValidationType, string>>;
type TranslateFn = TFunction<'common'[], undefined, 'common'[]>;

class Rules<TField extends FieldValues> {
  private _errorMessages: ErrorMessages;

  private _t: TranslateFn;

  constructor(errorMessages: ErrorMessages, translate: TranslateFn) {
    this._errorMessages = errorMessages;
    this._t = translate;
  }

  required(customMsg?: string) {
    const errorMessage = customMsg ?? this._errorMessages.required;

    return (value: FieldValue<TField>) => {
      validations.required(value, errorMessage);
    };
  }

  date(customMsg?: string) {
    const errorMessage = customMsg ?? this._errorMessages.date;

    return (value: FieldValue<TField>) => {
      validations.date(value, errorMessage);
    };
  }

  afterStartDate(startDatePath: FieldPath<TField>, customMsg?: string) {
    const errorMessage = customMsg ?? this._errorMessages.afterStartDate;

    return (date: FieldValue<TField>, fields: TField) => {
      validations.afterStartDate(date, fields[startDatePath], errorMessage);
    };
  }

  min(minNumber: number, customMsg?: string) {
    const errorMessage =
      customMsg ??
      this._t('common:errorMessages.min', {
        number: minNumber,
      });

    return (value: FieldValue<TField>) => {
      validations.min(value, minNumber, errorMessage);
    };
  }

  max(maxNumber: number, customMsg?: string) {
    const errorMessage =
      customMsg ??
      this._t('common:errorMessages.max', {
        number: maxNumber,
      });

    return (value: FieldValue<TField>) => {
      validations.max(value, maxNumber, errorMessage);
    };
  }

  minLength(minLength: number, customMsg?: string) {
    const errorMessage =
      customMsg ??
      this._t('common:errorMessages.minLength', {
        count: minLength,
      });

    return (value: FieldValue<TField>) => {
      validations.minLength(value, minLength, errorMessage);
    };
  }

  maxLength(maxLength: number, customMsg?: string) {
    const errorMessage =
      customMsg ??
      this._t('common:errorMessages.maxLength', {
        count: maxLength,
      });

    return (value: FieldValue<TField>) => {
      validations.maxLength(value, maxLength, errorMessage);
    };
  }

  isNumber(customMsg?: string) {
    const errorMessage =
      customMsg ?? this._t('common:errorMessages.invalidNumber');

    return (value: FieldValue<TField>) => {
      validations.isNumber(value, errorMessage);
    };
  }

  isEmail(customMsg?: string) {
    const errorMessage =
      customMsg ?? this._t('common:errorMessages.invalidEmail');

    return (value: FieldValue<TField>) => {
      validations.isEmail(value, errorMessage);
    };
  }

  isPhoneNumber(customMsg?: string) {
    const errorMessage =
      customMsg ?? this._t('common:errorMessages.invalidPhoneNumber');

    return (value: FieldValue<TField>) => {
      validations.isPhoneNumber(value, errorMessage);
    };
  }

  isUniqueByKey<T extends Record<string, FieldValue<TField>>>(
    array: Array<T>,
    keyName: keyof T,
    customMsg?: string
  ) {
    const errorMessage =
      customMsg ??
      this._t('common:errorMessages.invalidUniqueByKey', {
        name: keyName,
      });

    return (value: FieldValue<TField>) => {
      validations.isUniqueByKey(array, keyName, value, errorMessage);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  validate<V extends FieldValue<TField>>(
    validateFn: (
      value: V,
      throwError: (errorMessage: string) => ValidationError,
      formValues: TField,
      fieldArrayIndex: number | undefined
    ) => void
  ) {
    return (
      value: FieldValue<TField>,
      formValues: TField,
      fieldArrayIndex: string | undefined
    ) => {
      validateFn(
        value,
        (errorMessage) => {
          throw new ValidationError('validate', errorMessage);
        },
        formValues,
        fieldArrayIndex !== undefined ? Number(fieldArrayIndex) : undefined
      );
    };
  }
}

type ValidationFn<TField extends FieldValues> =
  | ReturnType<Rules<TField>[ValidationType]>
  | ReturnType<Rules<TField>[ValidationType]>[];

type NestedRules<TField extends FieldValues> = Record<
  string,
  ValidationFn<TField>
>;

type FieldRules<TField extends FieldValues> = Record<
  FieldPath<TField>,
  NestedRules<TField> | ValidationFn<TField>
>;

export const useFormValidator = <TField extends FieldValues>(): {
  rules: Rules<TField>;
  resolver: (schema: Partial<FieldRules<TField>>) => Resolver<TField>;
} => {
  const { t } = useTranslation(['common']);

  const rules = new Rules<TField>(
    {
      required: t('common:errorMessages.required'),
      date: t('common:errorMessages.invalidDate'),
      afterStartDate: t('common:errorMessages.afterStartDate'),
    },
    t
  );

  return {
    rules,
    resolver: (schema) => (fieldValues, _context, options) => {
      const keys = Object.keys(schema) as unknown as Array<keyof typeof schema>;

      const fieldsWithSchemaKey = keys
        .flatMap((schemaKey) => {
          const ruleFn = schema[schemaKey];
          const field = options.fields[schemaKey];

          if (Array.isArray(field)) {
            return (field as ResolverOptions<TField>['fields'][]).flatMap(
              (itemField) =>
                Object.keys(itemField).map((nestedKey) => ({
                  ...itemField[nestedKey],
                  ruleFn: (ruleFn as NestedRules<TField>)?.[nestedKey],
                }))
            );
          }

          return { ...field, ruleFn };
        })
        .filter(({ mount }) => mount);

      const errors = fieldsWithSchemaKey.reduce((fieldErrors, field) => {
        const [fieldName, index, itemField] = field.name.split('.');

        try {
          const currentValue = fieldValues[fieldName] as FieldValue<TField>;
          const nestedField = currentValue?.[index] as TField;
          const nestedValue = nestedField?.[itemField] as FieldValue<TField>;
          const fieldValue = itemField ? nestedValue : currentValue;

          if (Array.isArray(field.ruleFn)) {
            field.ruleFn.forEach((ruleFn) =>
              ruleFn(fieldValue, fieldValues, itemField ? index : undefined)
            );
          } else if (typeof field.ruleFn === 'function') {
            field.ruleFn(
              fieldValue,
              fieldValues,
              itemField ? index : undefined
            );
          }
        } catch (error) {
          const isKnownError = error instanceof ValidationError;

          const fieldError = {
            type: isKnownError ? error.type : field.name,
            message: isKnownError ? error.message : 'unknown error',
          };

          if (index && itemField) {
            const nestedErrors = fieldErrors[fieldName] as Record<
              string,
              FieldErrors
            >;

            fieldErrors[fieldName] = {
              ...fieldErrors[fieldName],
              [index]: {
                ...nestedErrors?.[index],
                [itemField]: fieldError,
              },
            };
          } else {
            fieldErrors[fieldName] = fieldError;
          }
        }

        return fieldErrors;
      }, {} as FieldErrors);

      if (Object.keys(errors).length > 0) {
        const flattenedErrors = flattenObject(
          errors
        ) as unknown as FieldErrors<FieldValues>;

        return {
          values: {},
          errors: toNestErrors(flattenedErrors, options),
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        values: fieldValues,
        errors: {},
      };
    },
  };
};
