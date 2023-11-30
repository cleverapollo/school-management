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
import { FormEvent, useMemo } from 'react';

const stripePromise = loadStripe(
  'pk_test_51MWMNZDT811pK8VExdSBnjE9DgKkb7FO9yxEIBv5MHYPHoHDO9fw78GI0Leb2EPEHzJGvXxU1IPiHAXK1YqRJYzj003FYTtroQ'
);

function Checkoutform() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const card = elements.getElement(CardElement);
    console.log({
      card,
    });

    if (!card) {
      return;
    }

    const result = await stripe.confirmCardPayment('{CLIENT_SECRET}', {
      payment_method: {
        card,
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button disabled={!stripe}>Confirm order</Button>
    </form>
  );
}

interface PayFeesModalProps {
  paymentInput: MakePaymentInput;
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
      <Checkoutform />
    </Elements>
  );
}
