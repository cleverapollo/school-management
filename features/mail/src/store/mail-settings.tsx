import { useDisclosure, UseDisclosureReturn } from '@tyro/core';
import { useContext, createContext, ReactNode, useMemo } from 'react';

export type MailSettingsContextValue = {
  sidebarDisclosure: UseDisclosureReturn;
};

const MailSettingsContext = createContext<MailSettingsContextValue | undefined>(
  undefined
);

export function MailSettingsProvider({ children }: { children: ReactNode }) {
  const sidebarDisclosure = useDisclosure({ defaultIsOpen: false });

  const value = useMemo(
    () => ({
      sidebarDisclosure,
    }),
    [sidebarDisclosure]
  );

  return (
    <MailSettingsContext.Provider value={value}>
      {children}
    </MailSettingsContext.Provider>
  );
}

export function useMailSettings() {
  const context = useContext(MailSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useMailSettings must be used within a MailSettingsContext'
    );
  }
  return context;
}
