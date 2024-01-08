import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Card,
  Stack,
  Typography,
} from '@mui/material';
import { PaymentMethod } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CoinsIcon, CreditCardIcon } from '@tyro/icons';
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
  [PaymentMethod.Card]: CreditCardIcon,
  [PaymentMethod.Cash]: CoinsIcon,
};

export const PaymentMethodSelect = <TField extends FieldValues>({
  controlProps,
}: PaymentMethodSelectProps<TField>) => {
  const fieldId = useId();
  const { t } = useTranslation(['fees']);
  const {
    field: { ref, name, value, onChange },
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
        {paymentMethods.map((paymentMethod, index) => {
          const Icon = paymentMethodIcons[paymentMethod];
          return (
            <FormControlLabel
              key={paymentMethod}
              value={paymentMethod}
              control={<Radio />}
              label={
                <Card
                  sx={{
                    borderRadius: 1,
                    minWidth: 80,
                    p: 1,
                    mt: 1,
                    border: '2px solid',
                    borderColor: 'transparent',
                    ...(paymentMethod === value
                      ? {
                          borderColor: 'primary.main',
                        }
                      : {}),
                  }}
                >
                  <Stack>
                    <Typography color="text.secondary">
                      {t(`fees:paymentMethods.${paymentMethod}`)}
                    </Typography>{' '}
                    <Icon />
                  </Stack>
                </Card>
              }
              sx={{
                m: 0,
                '& .MuiRadio-root': {
                  width: 0,
                  height: 0,
                  visibility: 'hidden',
                  padding: index === 0 ? 0 : undefined,
                },
              }}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};
