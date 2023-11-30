import {
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

export type PayFeesSettingsContextValue = {
  step: number;
  nextStep: () => void;
  previousStep: () => void;
  nextAction: () => unknown;
  setNextAction: Dispatch<SetStateAction<() => unknown>>;
};

const PayFeesSettingsContext = createContext<
  PayFeesSettingsContextValue | undefined
>(undefined);

export function PayFeesSettingsProvider({
  children,
}: {
  children: ReactNode | ((value: PayFeesSettingsContextValue) => ReactNode);
}) {
  const [step, setStep] = useState(0);
  const [nextAction, setNextAction] = useState<() => void>(() => {});

  const nextStep = () => {
    setStep((previousValue) => previousValue + 1);
  };

  const previousStep = () => {
    setStep((previousValue) => previousValue - 1);
  };

  console.log({
    nextAction,
  });

  const value = useMemo(
    () => ({
      step,
      nextStep,
      previousStep,
      nextAction,
      setNextAction,
    }),
    [step, nextStep, previousStep, nextAction, setNextAction]
  );

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
