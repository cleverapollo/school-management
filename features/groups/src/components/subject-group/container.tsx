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
import { useMemo } from 'react';
import { SubjectGroupStatusBar } from './status-bar';
import {
  useSubjectGroupById,
  useSubjectGroups,
} from '../../api/subject-groups';

export default function SubjectGroupContainer() {
  const { t } = useTranslation(['groups', 'common', 'people']);

  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: groupsListData = [] } = useSubjectGroups();
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
        type={ListNavigatorType.SubjectGroup}
        itemId={groupIdNumber}
        optionTextKey="name"
        getRenderOption={PartyListNavigatorMenuItem}
        defaultListData={defaultListData}
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
