import {
  TextField,
  useTheme,
  FormHelperText,
  FormControl,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import ReactPhoneInput, { CountryData } from 'react-phone-input-material-ui';
import 'react-phone-input-material-ui/lib/style.css';

export type MobileNumberData = {
  countryCode: CountryData['dialCode'];
  areaCode: string;
  number: string;
  numberMatchWithMask: boolean;
};

type RHFTextFieldProps<TField extends FieldValues> = {
  label: string;
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
      padding-left: ${theme.spacing(2.5)};
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
  label,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field: { name, onChange, ref },
    fieldState: { error },
  } = useController(controlProps);

  const { spacing } = useTheme();

  return (
    <FormControl fullWidth error={!!error}>
      <ReactPhoneInputStyled
        placeholder=""
        label={label}
        onChange={(number, data: CountryData, _event, formattedNumber) =>
          onChange({
            number: number.replace(data.dialCode, ''),
            countryCode: data.dialCode,
            numberMatchWithMask: formattedNumber.length === data.format.length,
          })
        }
        component={TextField}
        country={DEFAULT_COUNTRY}
        isValid={() => !error?.message}
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
        }}
      />
      <FormHelperText error={!!error}>{error?.message}</FormHelperText>
    </FormControl>
  );
};
