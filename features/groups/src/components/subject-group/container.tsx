import { Outlet, useParams } from 'react-router-dom';
import { useNumber, PageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SubjectGroupStatusBar } from './status-bar';
import { useSubjectGroupById } from '../../api/subject-groups';

export default function SubjectGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const subjectGroupName = t('groups:subjectGroupsProfile', {
    name: subjectGroupData?.name,
  });

  return (
    <PageContainer title={subjectGroupName}>
      <PageContainer.Header
        title={subjectGroupName}
        breadcrumbs={{
          links: [
            {
              name: t('groups:subjectGroups'),
              href: './..',
            },
            {
              name: subjectGroupName,
            },
          ],
        }}
      >
        <SubjectGroupStatusBar groupId={groupIdNumber} />
        <PageContainer.TabNavigation
          links={[
            {
              value: 'students',
              label: t('common:students'),
            },
            {
              value: 'attendance',
              label: t('common:attendance'),
            },
          ]}
        />
      </PageContainer.Header>
      <PageContainer.Content>
        <Outlet />
      </PageContainer.Content>
    </PageContainer>
  );
}
