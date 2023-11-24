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
import MailCompose, {
  ComposeMailFormValues,
} from '../components/common/compose';

export type MailSettingsContextValue = {
  sidebarDisclosure: UseDisclosureReturn;
  composeDisclosure: UseDisclosureReturn;
  activeProfileId: number;
  composeEmail: (defaultValue: Partial<ComposeMailFormValues>) => void;
};

const MailSettingsContext = createContext<MailSettingsContextValue | undefined>(
  undefined
);

export function MailSettingsProvider({ children }: { children: ReactNode }) {
  const [defaultComposeValue, setDefaultComposeValue] = useState<
    Partial<ComposeMailFormValues>
  >({});
  const sidebarDisclosure = useDisclosure({ defaultIsOpen: false });
  const composeDisclosure = useDisclosure({ defaultIsOpen: false });
  const { activeProfile } = useUser();
  const activeProfileId = activeProfile?.partyId ?? 0;

  const composeEmail = (defaultValue: Partial<ComposeMailFormValues>) => {
    setDefaultComposeValue(defaultValue);
    composeDisclosure.onOpen();
  };

  const value = useMemo(
    () => ({
      sidebarDisclosure,
      composeDisclosure,
      composeEmail,
      activeProfileId,
    }),
    [sidebarDisclosure, composeDisclosure, composeEmail, activeProfileId]
  );

  useEffect(() => {
    if (!composeDisclosure.isOpen) {
      sidebarDisclosure.onClose();
    }
  }, [composeDisclosure.isOpen]);

  return (
    <MailSettingsContext.Provider value={value}>
      {children}
      {composeDisclosure.isOpen && (
        <MailCompose
          onCloseCompose={composeDisclosure.onClose}
          defaultValues={defaultComposeValue}
        />
      )}
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
