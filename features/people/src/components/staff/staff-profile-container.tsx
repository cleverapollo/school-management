import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  TabPageContainer,
  PreferredNameFormat,
  PageContainer,
  ListNavigator,
  ListNavigatorType,
  PartyListNavigatorMenuItemParams,
  PartyListNavigatorMenuItem,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useStaff } from '../../api/staff';
import { StaffOverviewBar } from './staff-overview-bar';

export default function StaffProfileContainer() {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data = [] } = useStaff({ partyIds: idNumber ? [idNumber] : [] });
  const [staffData] = data;

  const { displayName } = usePreferredNameLayout();

  const userProfileName = t('people:usersProfile', {
    name: displayName(staffData?.person, {
      format: PreferredNameFormat.FirstnameSurname,
    }),
  });

  return (
    <PageContainer title={userProfileName}>
      <ListNavigator<PartyListNavigatorMenuItemParams>
        type={ListNavigatorType.Staff}
        itemId={idNumber}
        optionTextKey="name"
        estimateElementSize={52}
        getRenderOption={PartyListNavigatorMenuItem}
        pageHeadingProps={{
          title: userProfileName,
          breadcrumbs: {
            links: [
              {
                name: t('common:staff'),
                href: './..',
              },
              {
                name: userProfileName,
              },
            ],
          },
        }}
      />
      <StaffOverviewBar staffId={idNumber} />
      <TabPageContainer
        links={[
          {
            label: t('people:personal.title'),
            value: 'personal',
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:people:view_staff_personal_information'
              ),
          },
          {
            label: 'Timetable',
            value: 'timetable',
          },
          {
            label: 'Classes',
            value: 'classes',
          },
          {
            label: t('people:personal.nonClassContact'),
            value: 'non-class-contact',
          },
        ]}
      />
    </PageContainer>
  );
}
