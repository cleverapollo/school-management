import { useDisclosure, UseDisclosureReturn } from '@tyro/core';
import { useUser } from '@tyro/api';
import {
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
} from 'react';

export type PayFeesSettingsContextValue = {};

const PayFeesSettingsContext = createContext<
  PayFeesSettingsContextValue | undefined
>(undefined);

export function PayFeesSettingsProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((previousValue) => previousValue + 1);
  };

  const previousStep = () => {
    setStep((previousValue) => previousValue - 1);
  };

  // const value = useMemo(
  //   () => ({
  //     sidebarDisclosure,
  //     composeDisclosure,
  //     composeEmail,
  //     activeProfileId,
  //   }),
  //   [sidebarDisclosure, composeDisclosure, composeEmail, activeProfileId]
  // );

  return (
    <PayFeesSettingsContext.Provider value={{}}>
      {children}
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
