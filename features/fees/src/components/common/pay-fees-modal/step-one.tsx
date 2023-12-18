import {
  Collapse,
  Divider,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { PaymentMethod } from '@tyro/api';
import { Trans, useFormatNumber, useTranslation } from '@tyro/i18n';
import {
  RHFTextField,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { ReturnTypeFromUseStudentFees } from '../../../api/student-fees';
import { PaymentMethodSelect } from './fields/payment-method';
import { PaymentsToPayAndMethod, usePayFeesSettings } from './store';

interface PayFeesStepOneProps {
  feesToPay: ReturnTypeFromUseStudentFees[];
}

type FormValues = Omit<PaymentsToPayAndMethod, 'total'>;

export function PayFeesStepOne({ feesToPay }: PayFeesStepOneProps) {
  const { t } = useTranslation(['fees']);
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();
  const {
    setNextAction,
    paymentsToPayAndMethod,
    setPaymentsToPayAndMethod,
    nextStep,
  } = usePayFeesSettings();

  const { resolver, rules } = useFormValidator<FormValues>();
  const { handleSubmit, control, watch } = useForm<FormValues>({
    resolver: resolver({
      paymentMethod: [rules.required()],
      fees: {
        amountToPay: [
          rules.required(),
          rules.isNumber(),
          rules.min(0.5),
          rules.validate<string>((value, throwError, formValues, fieldArrayIndex) => {
            const fee = formValues.fees[fieldArrayIndex as number];
            const valueAsNumber = Number(value);

            if ((valueAsNumber ?? 0) > fee.amount - fee.amountPaid) {
              throwError(t('fees:amountToPayExceedsTheAmountThatsDue'));
            }
          }),
        ],
      },
    }),
    defaultValues: {
      paymentMethod:
        paymentsToPayAndMethod?.paymentMethod ?? PaymentMethod.Card,
      fees:
        paymentsToPayAndMethod?.fees ??
        feesToPay.map((fee) => ({
          ...fee,
          amountToPay: fee.amount - fee.amountPaid ?? 0,
        })),
    },
  });

  const [paymentMethod, fees] = watch(['paymentMethod', 'fees']);
  const { fields } = useFieldArray({
    control,
    name: 'fees',
    keyName: 'fieldId',
  });

  const total = useMemo(
    () => fees.reduce((acc, fee) => acc + Number(fee.amountToPay), 0),
    [JSON.stringify(fees)]
  );

  const onSubmit = handleSubmit((values) => {
    setPaymentsToPayAndMethod({
      total: values.fees.reduce((acc, fee) => acc + Number(fee.amountToPay), 0),
      paymentMethod: values.paymentMethod,
      fees: values.fees.map((fee) => ({
        ...fee,
        amountToPay: Number(fee.amountToPay),
      })),
    });
    nextStep();
  });

  useEffect(() => {
    setNextAction(() => onSubmit);
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <PaymentMethodSelect
          controlProps={{
            name: 'paymentMethod',
            control,
          }}
        />
        <Stack spacing={2}>
          <Typography variant="body1" color="slate.500">
            {t('fees:amountToPay', { count: feesToPay.length })}
          </Typography>
          <Stack>
            {fields.map((fee, index) => {
              const { feeName, person } = fee;
              const studentName = displayName(person);
              return (
                <Stack
                  key={fee.fieldId}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      lineHeight: 1.2,
                    }}
                  >
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

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <RHFTextField
                      controlProps={{
                        name: `fees.${index}.amountToPay`,
                        control,
                      }}
                      textFieldProps={{
                        sx: {
                          width: 100,
                        },
                        size: 'small',
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Typography>
                      {t('fees:ofFeeAmount', {
                        feeAmount: formatCurrency(fee.amount - fee.amountPaid),
                      })}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
          <Divider />
          <Stack alignItems="flex-end">
            <Typography variant="subtitle1">
              {t('fees:total')} {formatCurrency(total)}
            </Typography>
            <Collapse in={paymentMethod === PaymentMethod.Card}>
              <Typography variant="body1">
                {t('fees:serviceFee')} {formatCurrency(1.25)}
              </Typography>
            </Collapse>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
