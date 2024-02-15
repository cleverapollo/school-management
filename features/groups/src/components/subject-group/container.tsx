import { useParams } from 'react-router-dom';
import {
  useNumber,
  TabPageContainer,
  ListNavigator,
  ListNavigatorType,
  PageContainer,
  PartyListNavigatorMenuItem,
  PartyListNavigatorMenuItemParams,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SubjectGroupStatusBar } from './status-bar';
import { useSubjectGroupById } from '../../api/subject-groups';

export default function SubjectGroupContainer() {
  const { t } = useTranslation(['groups', 'common', 'people']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const subjectGroupName = t('groups:subjectGroupsProfile', {
    name: subjectGroupData?.name,
  });

  return (
    <PageContainer title={subjectGroupName}>
      <ListNavigator<PartyListNavigatorMenuItemParams>
        type={ListNavigatorType.SubjectGroup}
        itemId={groupIdNumber}
        optionTextKey="name"
        estimateElementSize={52}
        getRenderOption={PartyListNavigatorMenuItem}
        pageHeadingProps={{
          title: subjectGroupName,
          breadcrumbs: {
            links: [
              {
                name: t('groups:subjectGroups'),
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
          {
            value: 'behaviour',
            label: t('people:behaviour'),
          },
        ]}
      />
    </PageContainer>
  );
}
