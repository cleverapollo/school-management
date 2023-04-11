import { TFunction, useTranslation } from '@tyro/i18n';

import {
  FieldPath,
  FieldValues,
  Resolver,
  FieldErrors,
  FieldValue,
  ResolverOptions,
} from 'react-hook-form';
import { toNestError, validateFieldsNatively } from '@hookform/resolvers';
import { ValidationError, ValidationType, validations } from '../utils';

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
      const mountedFields = keys
        .filter((schemaKey) => options.fields[schemaKey])
        .map((schemaKey) => ({ field: options.fields[schemaKey], schemaKey }));

      const fieldsWithSchemaKey = mountedFields.flatMap(
        ({ field, schemaKey }) => {
          const ruleFn = schema[schemaKey];

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
        }
      );

      const errors = fieldsWithSchemaKey.reduce((fieldErrors, field) => {
        const [fieldName, index, itemField] = field.name.split('.');

        try {
          const currentValue = fieldValues[fieldName] as FieldValue<TField>;
          const nestedField = currentValue?.[index] as TField;
          const nestedValue = nestedField?.[itemField] as FieldValue<TField>;
          const fieldValue = itemField ? nestedValue : currentValue;

          if (Array.isArray(field.ruleFn)) {
            field.ruleFn.forEach((ruleFn) => ruleFn(fieldValue, fieldValues));
          } else if (typeof field.ruleFn === 'function') {
            field.ruleFn(fieldValue, fieldValues);
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
        return {
          values: {},
          errors: toNestError(errors, options),
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
