import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MakePaymentInput, PaymentMethod, PaymentStatus } from '@tyro/api';
import { Divider, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { Trans, useFormatNumber, useTranslation } from '@tyro/i18n';
import { usePreferredNameLayout, useToast } from '@tyro/core';
import { getPaymentSecret } from '../../../api/create-payment-secret';
import { usePayFeesSettings } from './store';

const stripePromise = loadStripe(
  'pk_test_51MWMNZDT811pK8VExdSBnjE9DgKkb7FO9yxEIBv5MHYPHoHDO9fw78GI0Leb2EPEHzJGvXxU1IPiHAXK1YqRJYzj003FYTtroQ'
);

interface PayFeesModalProps {
  paymentInput: MakePaymentInput;
}

function CardCheckoutForm({ paymentInput }: PayFeesModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation(['fees']);
  const {
    setNextAction,
    paymentsToPayAndMethod,
    onClose,
    setDisableConfirm,
    disableConfirm,
  } = usePayFeesSettings();
  const { formatCurrency } = useFormatNumber();
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }

    try {
      const { fees_createPayment: feesCreatePayment } = await getPaymentSecret(
        paymentInput
      );

      if (!feesCreatePayment) {
        toast(t('fees:paymentUnsuccessful'), { variant: 'error' });
        return;
      }

      const redirectUrl = new URL(window.location.href);
      redirectUrl.searchParams.set('paymentStatus', 'succeeded');

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: feesCreatePayment.clientSecret,
        confirmParams: {
          return_url: redirectUrl.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast(error.message, { variant: 'error' });
      } else {
        toast(t('fees:paymentSuccessful'));
        onClose();
      }
    } catch (error) {
      toast(t('fees:paymentUnsuccessful'), { variant: 'error' });
    }
  }, [stripe, elements, paymentInput, toast]);

  useEffect(() => {
    setDisableConfirm(!stripe || !elements);
  }, [stripe, elements]);

  useEffect(() => {
    setNextAction(() => handleSubmit);
  }, [setNextAction, handleSubmit]);

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography variant="subtitle1" color="text.secondary">
          {t('fees:totalPayingToday')}
        </Typography>
        <Typography variant="h5">
          {formatCurrency(paymentsToPayAndMethod?.total ?? 0)}
        </Typography>
      </Stack>
      <Divider />
      <PaymentElement />
    </Stack>
  );
}

function CashCheckoutForm({ paymentInput }: PayFeesModalProps) {
  const { t } = useTranslation(['common', 'fees']);
  const { setNextAction, paymentsToPayAndMethod, onClose } =
    usePayFeesSettings();
  const { displayName } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    try {
      await getPaymentSecret(paymentInput);
      toast(t('fees:paymentSuccessful'));
      onClose();
    } catch (error) {
      toast(t('fees:paymentUnsuccessful'), { variant: 'error' });
    }
  }, [paymentInput]);

  useEffect(() => {
    setNextAction(() => handleSubmit);
  }, [setNextAction, handleSubmit]);

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography variant="subtitle1" color="text.secondary">
          {t('fees:totalPayingToday')}
        </Typography>
        <Typography variant="h5">
          {formatCurrency(paymentsToPayAndMethod?.total ?? 0)}
        </Typography>
      </Stack>
      <Divider />
      <Typography variant="body1" color="slate.500">
        {t('common:summary')}
      </Typography>
      <Stack>
        {paymentsToPayAndMethod?.fees.map((fee) => {
          const { feeName, person } = fee;
          const studentName = displayName(person);
          return (
            <Stack key={fee.id} direction="row" justifyContent="space-between">
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

              <Typography>
                {formatCurrency(fee.amountToPay)}{' '}
                {t('fees:ofFeeAmount', {
                  feeAmount: formatCurrency(fee.amount - fee.amountPaid),
                })}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export function PayFeesStepTwo() {
  const { paymentsToPayAndMethod } = usePayFeesSettings();

  const paymentInput = useMemo(
    () => ({
      paymentAmounts:
        paymentsToPayAndMethod?.fees.map(({ id, amountToPay, person }) => ({
          feeId: id,
          amount: amountToPay,
          studentPartyId: person.partyId,
        })) ?? [],
      paymentMethod:
        paymentsToPayAndMethod?.paymentMethod ?? PaymentMethod.Card,
      paymentStatus: PaymentStatus.Created,
    }),
    [paymentsToPayAndMethod]
  );

  const options = useMemo(
    () =>
      ({
        mode: 'payment',
        currency: 'eur',
        amount: (paymentsToPayAndMethod?.total ?? 0) * 100, // Convert to cents
      } as const),
    [paymentsToPayAndMethod]
  );

  if (!paymentsToPayAndMethod) return null;

  return paymentsToPayAndMethod.paymentMethod === PaymentMethod.Cash ? (
    <CashCheckoutForm paymentInput={paymentInput} />
  ) : (
    <Elements stripe={stripePromise} options={options}>
      <CardCheckoutForm paymentInput={paymentInput} />
    </Elements>
  );
}
