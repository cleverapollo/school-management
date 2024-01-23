import {
  Collapse,
  Divider,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import { PaymentMethod, usePermissions } from '@tyro/api';
import { Trans, useFormatNumber, useTranslation } from '@tyro/i18n';
import {
  RHFRadioGroup,
  RHFTextField,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useId, useMemo } from 'react';
import { ReturnTypeFromUseStudentFees } from '../../../api/student-fees';
import { PaymentMethodSelect } from './fields/payment-method';
import { PaymentsToPayAndMethod, usePayFeesSettings } from './store';
import { useServiceCharge } from '../../../api/service-charge';

interface PayFeesStepOneProps {
  feesToPay: ReturnTypeFromUseStudentFees[];
}

type FormValues = Omit<PaymentsToPayAndMethod, 'total'> & {
  paymentType: 'full' | 'partial';
};

export function PayFeesStepOne({ feesToPay }: PayFeesStepOneProps) {
  const { t } = useTranslation(['common', 'fees']);
  const componentId = useId();
  const { isStaffUser } = usePermissions();
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();
  const {
    setNextAction,
    paymentsToPayAndMethod,
    setPaymentsToPayAndMethod,
    nextStep,
  } = usePayFeesSettings();

  const { resolver, rules } = useFormValidator<FormValues>();
  const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
    resolver: resolver({
      paymentMethod: [rules.required()],
      fees: {
        amountToPay: [
          rules.required(),
          rules.isNumber(),
          rules.min(0.5),
          rules.validate((value, throwError, formValues, fieldArrayIndex) => {
            const fee = formValues.fees[fieldArrayIndex as number];

            if ((value ?? 0) > fee.amount - fee.amountPaid) {
              throwError(t('fees:amountToPayExceedsTheAmountThatsDue'));
            }
          }),
        ],
      },
    }),
    defaultValues: {
      paymentMethod:
        paymentsToPayAndMethod?.paymentMethod ?? PaymentMethod.Card,
      paymentType: 'full',
      fees:
        paymentsToPayAndMethod?.fees ??
        feesToPay.map((fee) => ({
          ...fee,
          amountToPay: fee.amountDue ?? 0,
        })),
    },
  });

  const [paymentMethod, paymentType, fees] = watch([
    'paymentMethod',
    'paymentType',
    'fees',
  ]);
  const { fields } = useFieldArray({
    control,
    name: 'fees',
    keyName: 'fieldId',
  });

  const { data: serviceCharge } = useServiceCharge({
    charges: fees.map(({ id, amountToPay }) => ({
      feeId: id.feeId,
      amount: amountToPay,
    })),
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
    if (paymentType === 'full') {
      setValue(
        'fees',
        fees.map((fee) => ({
          ...fee,
          amountToPay: fee.amountDue ?? 0,
        }))
      );
    }
  }, [paymentType]);

  useEffect(() => {
    setNextAction(() => onSubmit);
  }, []);

  const descriptionId = `${componentId}-description`;
  const totalId = `${componentId}-total`;

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        {isStaffUser && (
          <PaymentMethodSelect
            controlProps={{
              name: 'paymentMethod',
              control,
            }}
          />
        )}
        <RHFRadioGroup
          controlProps={{
            name: 'paymentType',
            control,
          }}
          radioGroupProps={{
            row: true,
          }}
          label={t('fees:paymentType')}
          options={[
            {
              label: t('fees:payInFull'),
              value: 'full',
            },
            {
              label: t('fees:partialPayment'),
              value: 'partial',
            },
          ]}
        />
        <Stack
          spacing={2}
          sx={{
            backgroundColor: 'slate.100',
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography
              variant="subtitle1"
              color="slate.500"
              id={descriptionId}
            >
              {t('common:description')}
            </Typography>
            <Typography variant="subtitle1" color="slate.500" id={totalId}>
              {t('common:total')}
            </Typography>
          </Stack>
          <Stack>
            {fields.map((fee, index) => {
              const { feeName, person } = fee;
              const studentName = displayName(person);
              const partialInputId = `${componentId}-partial-${index}`;

              return (
                <Stack
                  key={fee.fieldId}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    aria-labelledby={descriptionId}
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

                  <Stack
                    alignItems="flex-end"
                    spacing={1}
                    aria-labelledby={totalId}
                  >
                    <Typography variant="subtitle1" component="p">
                      {formatCurrency(fee.amountDue ?? 0)}
                    </Typography>
                    <Collapse in={paymentType === 'partial'}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <InputLabel htmlFor={partialInputId}>
                          {t('fees:partial')}
                        </InputLabel>
                        <RHFTextField
                          controlProps={{
                            name: `fees.${index}.amountToPay`,
                            control,
                          }}
                          textFieldProps={{
                            id: partialInputId,
                            sx: {
                              width: 100,
                              '& .MuiInputBase-root': {
                                backgroundColor: 'white',
                              },
                            },
                            size: 'small',
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  €
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Stack>
                    </Collapse>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
          <Divider sx={{ borderColor: 'slate.200' }} />
          <Stack alignItems="flex-end">
            <Typography variant="subtitle1">
              {t('fees:total')} {formatCurrency(total)}
            </Typography>
            <Collapse in={paymentMethod === PaymentMethod.Card}>
              <Typography variant="body1">
                {t('fees:serviceFee')}{' '}
                {formatCurrency(
                  (serviceCharge?.userServiceCharge ?? 0) +
                    (serviceCharge?.userVat ?? 0)
                )}
              </Typography>
            </Collapse>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
