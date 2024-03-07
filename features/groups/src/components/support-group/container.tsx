import { useParams } from 'react-router-dom';
import {
  useNumber,
  TabPageContainer,
  ListNavigator,
  ListNavigatorType,
  PageContainer,
  PartyListNavigatorMenuItemParams,
  PartyListNavigatorMenuItem,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { SubjectGroupStatusBar } from './status-bar';
import { useSubjectGroupById } from '../../api/subject-groups';
import { useSupportGroups } from '../../api/support-groups';

export default function SupportGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: groupsListData = [] } = useSupportGroups();
  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const subjectGroupName = t('groups:subjectGroupsProfile', {
    name: subjectGroupData?.name,
  });

  const defaultListData = useMemo(
    () =>
      (groupsListData || []).map<PartyListNavigatorMenuItemParams>((group) => {
        const subject = group.subjects?.[0];
        const bgColorStyle = subject?.colour
          ? { bgcolor: `${subject.colour}.500` }
          : {};

        return {
          id: group.partyId,
          name: group.name,
          type: 'group',
          avatarProps: {
            sx: {
              ...bgColorStyle,
            },
          },
        };
      }),
    [groupsListData]
  );

  return (
    <PageContainer title={subjectGroupName}>
      <ListNavigator<PartyListNavigatorMenuItemParams>
        type={ListNavigatorType.SupportGroup}
        itemId={groupIdNumber}
        optionTextKey="name"
        getRenderOption={PartyListNavigatorMenuItem}
        defaultListData={defaultListData}
        pageHeadingProps={{
          title: subjectGroupName,
          breadcrumbs: {
            links: [
              {
                name: t('groups:supportGroups'),
                href: './..',
              },
              {
                name: subjectGroupName,
              },
            ],
          },
        }}
      />
      <SubjectGroupStatusBar groupId={groupIdNumber} />
      <TabPageContainer
        links={[
          {
            value: 'students',
            label: t('common:students'),
          },
          {
            value: 'attendance',
            label: t('common:attendance'),
          },
          {
            value: 'timetable',
            label: t('common:timetable'),
          },
        ]}
      />
    </PageContainer>
  );
}
