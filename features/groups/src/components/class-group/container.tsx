import { useParams } from 'react-router-dom';
import {
  useNumber,
  PageContainer,
  TabPageContainer,
  ListNavigatorType,
  ListNavigator,
  PartyListNavigatorMenuItemParams,
  PartyListNavigatorMenuItem,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { ClassGroupStatusBar } from './status-bar';
import { useClassGroupById, useClassGroups } from '../../api/class-groups';

export default function ClassGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: groupsListData = [] } = useClassGroups();
  const { data: classGroupData } = useClassGroupById(groupIdNumber);

  const classGroupName = t('groups:subjectGroupsProfile', {
    name: classGroupData?.name,
  });

  const defaultListData = useMemo(
    () =>
      (groupsListData || []).map<PartyListNavigatorMenuItemParams>((group) => ({
        id: group.partyId,
        name: group.name,
        caption: group.yearGroups.map((year) => year.name).join(', '),
        type: 'group',
      })),
    [groupsListData]
  );

  return (
    <PageContainer title={classGroupName}>
      <ListNavigator<PartyListNavigatorMenuItemParams>
        type={ListNavigatorType.ClassGroup}
        itemId={groupIdNumber}
        optionTextKey="name"
        estimateElementSize={52}
        getRenderOption={PartyListNavigatorMenuItem}
        defaultListData={defaultListData}
        pageHeadingProps={{
          title: classGroupName,
          breadcrumbs: {
            links: [
              {
                name: t('groups:classGroups'),
                href: './..',
              },
              {
                name: classGroupName,
              },
            ],
          },
        }}
      />
      <ClassGroupStatusBar groupId={groupIdNumber} />
      <TabPageContainer
        links={[
          {
            value: 'students',
            label: t('common:students'),
          },
          {
            value: 'subject-groups',
            label: t('groups:subjectGroups'),
          },
          {
            value: 'attendance',
            label: t('common:attendance'),
            hasAccess: ({ isStaffUserWithPermission }) =>
              isStaffUserWithPermission(
                'ps:1:attendance:read_session_attendance_class_group'
              ),
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
