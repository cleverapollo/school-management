import { Stack, Typography } from '@mui/material';
import { PaymentMethod } from '@tyro/api';
import { Trans, useTranslation } from '@tyro/i18n';
import { usePreferredNameLayout } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { ReturnTypeFromUseStudentFees } from '../../../api/student-fees';
import { PaymentMethodSelect } from './fields/payment-method';

interface PayFeesStepOneProps {
  feesToPay: ReturnTypeFromUseStudentFees[];
}

type FormValues = {
  paymentMethod: PaymentMethod;
};

export function PayFeesStepOne({ feesToPay }: PayFeesStepOneProps) {
  const { t } = useTranslation(['fees']);
  const { displayName } = usePreferredNameLayout();
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      paymentMethod: PaymentMethod.Card,
      ...feesToPay.map((fee) => ({
        [fee.id]: fee.amount - fee.amountPaid,
      })),
    },
  });

  const onSubmit = handleSubmit((values) => {
    console.log(values);
  });

  return (
    <form onSubmit={onSubmit}>
      <PaymentMethodSelect
        controlProps={{
          name: 'paymentMethod',
          control,
        }}
      />
      <Typography variant="h6">Amounts to pay</Typography>
      <Stack>
        {feesToPay.map((fee) => {
          const { feeName, person } = fee;
          const studentName = displayName(person);
          return (
            <Stack key={fee.id} direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" component="span">
                <Trans ns="fees" i18nKey="feeNameForStudent">
                  {{ feeName }}
                  <br />
                  <Typography
                    variant="body2"
                    component="span"
                    color="text.secondary"
                  >
                    <>for {{ studentName }}</>
                  </Typography>
                </Trans>
              </Typography>

              <Typography>{fee.amount - fee.amountPaid}</Typography>
            </Stack>
          );
        })}
      </Stack>
    </form>
  );
}
