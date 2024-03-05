import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  TabPageContainer,
  PageContainer,
  ListNavigator,
  ListNavigatorType,
  PartyListNavigatorMenuItemParams,
  PartyListNavigatorMenuItem,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { ContactOverviewBar } from './contact-overview-bar';
import { useContactPersonal } from '../../api/contact/personal';
import { useContactsForSelect } from '../../api/contact/list';

export default function ContactProfileContainer() {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data: contactData } = useContactPersonal(idNumber);
  const { data: contactsListData = [] } = useContactsForSelect({});

  const { displayName } = usePreferredNameLayout();

  const userProfileName = t('people:usersProfile', {
    name: displayName(contactData?.person),
  });

  const defaultListData = useMemo(
    () =>
      contactsListData.map<PartyListNavigatorMenuItemParams>((contact) => ({
        id: contact.partyId,
        type: 'person',
        name: displayName(contact),
        firstName: contact.firstName,
        lastName: contact.lastName,
        avatarUrl: contact.avatarUrl,
      })),
    [contactsListData]
  );

  return (
    <PageContainer title={userProfileName}>
      <ListNavigator<PartyListNavigatorMenuItemParams>
        type={ListNavigatorType.Contact}
        itemId={idNumber}
        optionTextKey="name"
        getRenderOption={PartyListNavigatorMenuItem}
        defaultListData={defaultListData}
        pageHeadingProps={{
          title: userProfileName,
          breadcrumbs: {
            links: [
              {
                name: t('people:contacts'),
                href: './..',
              },
              {
                name: userProfileName,
              },
            ],
          },
        }}
      />
      <ContactOverviewBar contactId={idNumber} />
      <TabPageContainer
        links={[
          {
            label: t('people:personal.title'),
            value: 'personal',
          },
          {
            label: t('common:students'),
            value: 'students',
          },
          // NOTE: hide temporary this tab
          // {
          //   label: 'Fees',
          //   value: 'fees',
          // },
          {
            label: 'Access',
            value: 'access',
          },
        ]}
      />
    </PageContainer>
  );
}
