import {
  useDebouncedValue,
  useDisclosure,
  UseDisclosureReturn,
} from '@tyro/core';
import { RecipientSearchType, SearchType, useUser } from '@tyro/api';
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
import {
  MailRecipientType,
  SelectMailRecipientTypeModal,
} from '../components/common/select-mail-recipient-type-modal';
import { resolveMailRecipients } from '../api/mail-recipients';

export type MailSettingsContextValue = {
  sidebarDisclosure: UseDisclosureReturn;
  composeDisclosure: UseDisclosureReturn;
  activeProfileId: number;
  composeEmail: (defaultValue: Partial<ComposeMailFormValues>) => void;
  sendMailToParties: (
    partyIds: number[],
    possibleMailRecipientTypes: MailRecipientType[]
  ) => void;
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
  const {
    value: selectMailRecipientSettings,
    debouncedValue: debouncedSelectMailRecipientSettings,
    setValue: setSelectMailRecipientSettings,
  } = useDebouncedValue<
    | {
        partyIds: number[];
        possibleRecipientTypes: MailRecipientType[];
      }
    | undefined
  >({ defaultValue: undefined });
  const { activeProfile } = useUser();
  const activeProfileId = activeProfile?.partyId ?? 0;

  const composeEmail = (defaultValue: Partial<ComposeMailFormValues>) => {
    setDefaultComposeValue(defaultValue);
    composeDisclosure.onOpen();
  };

  const composeEmailToParties = async (
    partyIds: number[],
    possibleMailRecipientTypes: RecipientSearchType[]
  ) => {
    const { communications_recipients: communicationsRecipients } =
      await resolveMailRecipients({
        partyIds,
        recipientType: possibleMailRecipientTypes,
      });

    if (selectMailRecipientSettings) {
      setSelectMailRecipientSettings(undefined);
    }
    composeEmail({
      canReply: false,
      bccRecipients: communicationsRecipients,
    });
  };

  const sendMailToParties = (
    partyIds: number[],
    possibleMailRecipientTypes: MailRecipientType[]
  ) => {
    if (
      process.env.NODE_ENV !== 'production' &&
      !(partyIds?.length > 0 && possibleMailRecipientTypes?.length > 0)
    ) {
      throw new Error(
        'partyIds and possibleMailRecipientTypes must not be empty when calling sendMailToParties'
      );
    }

    if (possibleMailRecipientTypes.length === 1) {
      composeEmailToParties(partyIds, [possibleMailRecipientTypes[0].type]);
    } else {
      setSelectMailRecipientSettings({
        partyIds,
        possibleRecipientTypes: possibleMailRecipientTypes,
      });
    }
  };

  const value = useMemo(
    () => ({
      sidebarDisclosure,
      composeDisclosure,
      composeEmail,
      activeProfileId,
      sendMailToParties,
    }),
    [
      sidebarDisclosure,
      composeDisclosure,
      composeEmail,
      activeProfileId,
      sendMailToParties,
    ]
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
      <SelectMailRecipientTypeModal
        isOpen={!!selectMailRecipientSettings}
        onClose={() => setSelectMailRecipientSettings(undefined)}
        onSubmit={composeEmailToParties}
        settings={
          selectMailRecipientSettings || debouncedSelectMailRecipientSettings
        }
      />
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
