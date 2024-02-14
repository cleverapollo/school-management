import { useParams } from 'react-router-dom';
import {
  useNumber,
  TabPageContainer,
  ProfileListNavigation,
  ProfilePageNavigation,
  PageContainer,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SubjectGroupStatusBar } from './status-bar';
import { useSubjectGroupById } from '../../api/subject-groups';

export default function SupportGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const subjectGroupName = t('groups:subjectGroupsProfile', {
    name: subjectGroupData?.name,
  });

  return (
    <PageContainer title={subjectGroupName}>
      <ProfileListNavigation
        profile={ProfilePageNavigation.SupportGroup}
        profileId={groupIdNumber}
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
