import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Card,
  Stack,
} from '@mui/material';
import { PaymentMethod } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useId } from 'react';
import {
  UseControllerProps,
  FieldValues,
  useController,
} from 'react-hook-form';

type PaymentMethodSelectProps<TField extends FieldValues> = {
  controlProps: UseControllerProps<TField>;
};

const paymentMethods = [PaymentMethod.Card, PaymentMethod.Cash];
const paymentMethodIcons = {
  [PaymentMethod.Card]: 'credit-card',
  [PaymentMethod.Cash]: 'cash',
};

export const PaymentMethodSelect = <TField extends FieldValues>({
  controlProps,
}: PaymentMethodSelectProps<TField>) => {
  const fieldId = useId();
  const { t } = useTranslation(['fees']);
  const {
    field: { ref, name, value, onChange },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <FormControl>
      <FormLabel id={fieldId}>{t('fees:paymentMethod')}</FormLabel>
      <RadioGroup
        ref={ref}
        row
        aria-labelledby={fieldId}
        name={name}
        value={value}
        onChange={onChange}
      >
        {paymentMethods.map((paymentMethod) => (
          <FormControlLabel
            key={paymentMethod}
            value={paymentMethod}
            control={<Radio />}
            label={
              <Card>
                <Stack>{t(`fees:paymentMethods.${paymentMethod}`)}</Stack>
              </Card>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
