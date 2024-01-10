import { PaymentMethod } from '@tyro/api';
import {
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { ReturnTypeFromUseStudentFees } from '../../../api/student-fees';

export type PaymentsToPayAndMethod = {
  paymentMethod: PaymentMethod;
  fees: (ReturnTypeFromUseStudentFees & { amountToPay: number })[];
  total: number;
};

export type PayFeesSettingsContextValue = {
  onClose: () => void;
  step: number;
  nextStep: () => void;
  previousStep: () => void;
  nextAction: () => unknown;
  setNextAction: Dispatch<SetStateAction<() => unknown>>;
  paymentsToPayAndMethod: PaymentsToPayAndMethod | undefined;
  setPaymentsToPayAndMethod: Dispatch<
    SetStateAction<PaymentsToPayAndMethod | undefined>
  >;
  disableConfirm: boolean;
  setDisableConfirm: Dispatch<SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const PayFeesSettingsContext = createContext<
  PayFeesSettingsContextValue | undefined
>(undefined);

export function PayFeesSettingsProvider({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode | ((value: PayFeesSettingsContextValue) => ReactNode);
}) {
  const [step, setStep] = useState(0);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextAction, setNextAction] = useState<() => void>(() => {});
  const [paymentsToPayAndMethod, setPaymentsToPayAndMethod] = useState<
    PaymentsToPayAndMethod | undefined
  >();

  const nextStep = () => {
    setStep((previousValue) => previousValue + 1);
  };

  const previousStep = () => {
    setStep((previousValue) => previousValue - 1);
  };

  const value = useMemo(
    () => ({
      onClose,
      step,
      nextStep,
      previousStep,
      nextAction,
      setNextAction,
      setPaymentsToPayAndMethod,
      paymentsToPayAndMethod,
      disableConfirm,
      setDisableConfirm,
      isSubmitting,
      setIsSubmitting,
    }),
    [
      onClose,
      step,
      nextStep,
      previousStep,
      nextAction,
      setNextAction,
      setPaymentsToPayAndMethod,
      paymentsToPayAndMethod,
      disableConfirm,
      setDisableConfirm,
      isSubmitting,
      setIsSubmitting,
    ]
  );

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0);
        setPaymentsToPayAndMethod(undefined);
        setNextAction(() => {});
      }, 500);
    }
  }, [open]);

  return (
    <PayFeesSettingsContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </PayFeesSettingsContext.Provider>
  );
}

export function usePayFeesSettings() {
  const context = useContext(PayFeesSettingsContext);
  if (context === undefined) {
    throw new Error('usePayFeesSettings must be used within a PayFeesContext');
  }
  return context;
}
