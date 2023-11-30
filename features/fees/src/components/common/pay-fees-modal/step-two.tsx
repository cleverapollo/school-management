import { Button } from '@mui/material';
import {
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MakePaymentInput } from '@tyro/api';
import { useCallback, useEffect, useMemo } from 'react';
import { getPaymentSecret } from '../../../api/create-payment-secret';
import { usePayFeesSettings } from './store';

const stripePromise = loadStripe(
  'pk_test_51MWMNZDT811pK8VExdSBnjE9DgKkb7FO9yxEIBv5MHYPHoHDO9fw78GI0Leb2EPEHzJGvXxU1IPiHAXK1YqRJYzj003FYTtroQ'
);

interface PayFeesModalProps {
  paymentInput: MakePaymentInput;
}

function Checkoutform({ paymentInput }: PayFeesModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { setNextAction } = usePayFeesSettings();

  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit');
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.log({
        submitError,
      });
      return;
    }

    const { fees_createPayment } = await getPaymentSecret(paymentInput);

    const redirectUrl = new URL(window.location.href);
    redirectUrl.searchParams.set('paymentStatus', 'succeeded');

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: fees_createPayment.clientSecret,
      confirmParams: {
        return_url: redirectUrl.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      // Show error to your customer (for example, insufficient funds)
      console.log(error.message);
    } else {
      console.log('Success');
    }
  }, [stripe, elements, paymentInput]);

  useEffect(() => {
    setNextAction(() => handleSubmit);
  }, [setNextAction, handleSubmit]);

  return <PaymentElement />;
}

export function PayFeesStepTwo({ paymentInput }: PayFeesModalProps) {
  const options = useMemo(() => {
    const amount = paymentInput.paymentAmounts.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    return {
      mode: 'payment',
      currency: 'eur',
      amount,
    } as const;
  }, [paymentInput]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <Checkoutform paymentInput={paymentInput} />
    </Elements>
  );
}
