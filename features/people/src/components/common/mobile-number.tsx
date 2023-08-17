import {
  TextField,
  useTheme,
  FormHelperText,
  FormControl,
  TextFieldProps,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { formatPhoneNumber } from '@tyro/core';
import { useMemo } from 'react';

import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import ReactPhoneInput, { CountryData } from 'react-phone-input-material-ui';
import 'react-phone-input-material-ui/lib/style.css';

export type MobileNumberData = {
  countryCode?: CountryData['dialCode'] | null | undefined;
  areaCode?: string | null | undefined;
  number?: string | null | undefined;
  numberMatchWithMask?: boolean;
};

type RHFTextFieldProps<TField extends FieldValues> = {
  label?: string;
  variant?: TextFieldProps['variant'];
  controlProps: UseControllerProps<TField>;
};

const DEFAULT_COUNTRY = 'ie';

const ReactPhoneInputStyled = styled(ReactPhoneInput)(
  ({ theme }) => `
   &.react-tel-input {
    .country-list {
      margin: 0;
      box-shadow: ${theme.customShadows.dropdown};
      padding: ${theme.spacing(0, 1)};
      border-radius: ${theme.spacing(1)};
    }
    .selected-flag {
      display: flex;
      align-items: center;
      padding-left: ${theme.spacing(2)};
      margin-top: 0;

     .flag {
        position: static;
        margin-top: 0;
      }
    }
    li.country {
      font-size: ${theme.typography.fontSize}px;
      font-weight: 600;
      padding: ${theme.spacing(1)};
      margin: ${theme.spacing(0.75, 0)};
      border-radius: ${theme.shape.borderRadius}px;
      &:focus,
      &:hover {
        background-color: ${theme.palette.action.hover};
      }
      &.highlight {
        background-color: ${theme.palette.action.selected};
      }
    }
  }
`
);

export const MobileNumber = <TField extends FieldValues>({
  variant,
  label,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field: { value, name, onChange, ref },
    fieldState: { error },
  } = useController(controlProps);

  const { spacing } = useTheme();

  const formattedValue = useMemo(() => {
    const initialValue: MobileNumberData = value;
    if (!initialValue) return null;
    if (typeof initialValue === 'string') return initialValue;

    return formatPhoneNumber(initialValue);
  }, [value]);

  return (
    <FormControl fullWidth error={!!error}>
      <ReactPhoneInputStyled
        placeholder=""
        label={label ?? ''}
        onChange={(number, data: CountryData, _event, formattedNumber) =>
          onChange({
            number: number.replace(data.dialCode, ''),
            countryCode: `+${data.dialCode}`,
            numberMatchWithMask: formattedNumber.length === data.format.length,
          })
        }
        value={formattedValue}
        country={DEFAULT_COUNTRY}
        component={TextField}
        isValid={() => !error?.message}
        enableLongNumbers
        inputProps={{
          name,
          ref,
          sx: {
            '& label.MuiInputLabel-formControl': {
              paddingLeft: spacing(5),
            },
            '& .MuiInputBase-input[type="tel"]': {
              height: 'auto',
              paddingLeft: spacing(7),
            },
          },
          variant,
        }}
      />
      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
};
