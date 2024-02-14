import { useParams } from 'react-router-dom';
import {
  useNumber,
  PageContainer,
  TabPageContainer,
  ProfileListNavigation,
  ProfilePageNavigation,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ClassGroupStatusBar } from './status-bar';
import { useClassGroupById } from '../../api/class-groups';

export default function ClassGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: classGroupData } = useClassGroupById(groupIdNumber);

  const classGroupName = t('groups:subjectGroupsProfile', {
    name: classGroupData?.name,
  });

  return (
    <PageContainer title={classGroupName}>
      <ProfileListNavigation
        profile={ProfilePageNavigation.ClassGroup}
        profileId={groupIdNumber}
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
