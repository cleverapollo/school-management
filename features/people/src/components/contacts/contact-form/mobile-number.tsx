import {
  TextField,
  useTheme,
  FormHelperText,
  FormControl,
} from '@mui/material';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import ReactPhoneInput, { CountryData } from 'react-phone-input-material-ui';
import 'react-phone-input-material-ui/lib/style.css';

export type MobileNumberData = {
  countryCode: CountryData['countryCode'];
  areaCode: CountryData['dialCode'];
  number: string;
  numberMatchWithMask: boolean;
};

type RHFTextFieldProps<TField extends FieldValues> = {
  label: string;
  controlProps: UseControllerProps<TField>;
};

const DEFAULT_COUNTRY = 'ie';

export const MobileNumber = <TField extends FieldValues>({
  label,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field: { value, name, onChange, ref },
    fieldState: { error },
  } = useController(controlProps);

  const { spacing } = useTheme();

  return (
    <FormControl fullWidth>
      <ReactPhoneInput
        placeholder=""
        label={label}
        value={value?.number as MobileNumberData['number']}
        onChange={(number, data: CountryData, _event, formattedNumber) =>
          onChange({
            number,
            countryCode: data.countryCode,
            areaCode: data.dialCode,
            numberMatchWithMask: formattedNumber.length === data.format.length,
          })
        }
        component={TextField}
        country={DEFAULT_COUNTRY}
        jumpCursorToEnd
        isValid={() => !error?.message}
        buttonStyle={{
          paddingLeft: spacing(1.5),
        }}
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
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </FormControl>
  );
};
