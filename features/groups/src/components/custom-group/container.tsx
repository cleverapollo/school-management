import { useParams } from 'react-router-dom';
import {
  useNumber,
  TabPageContainer,
  PageContainer,
  ListNavigator,
  ListNavigatorType,
  PartyListNavigatorMenuItem,
  PartyListNavigatorMenuItemParams,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { CustomGroupStatusBar } from './status-bar';
import { useCustomGroupDefinition, useCustomGroups } from '../../api';

export default function SupportGroupContainer() {
  const { t } = useTranslation(['groups', 'common']);

  const { groupId } = useParams();
  const partyId = useNumber(groupId) ?? 0;

  const { data: groupsListData = [] } = useCustomGroups();
  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const customGroupName = t('groups:subjectGroupsProfile', {
    name: customGroupData?.name,
  });

  const defaultListData = useMemo(
    () =>
      (groupsListData || []).map<PartyListNavigatorMenuItemParams>((group) => ({
        id: group.partyId,
        name: group.name,
        type: 'group',
      })),
    [groupsListData]
  );

  return (
    <PageContainer title={customGroupName}>
      <ListNavigator<PartyListNavigatorMenuItemParams>
        type={ListNavigatorType.CustomGroup}
        itemId={partyId}
        optionTextKey="name"
        estimateElementSize={44}
        getRenderOption={PartyListNavigatorMenuItem}
        defaultListData={defaultListData}
        pageHeadingProps={{
          title: customGroupName,
          breadcrumbs: {
            links: [
              {
                name: t('groups:customGroups'),
                href: './..',
              },
              {
                name: customGroupName,
              },
            ],
          },
        }}
      />
      <CustomGroupStatusBar partyId={partyId} />
      <TabPageContainer
        links={[
          {
            value: 'students',
            label: t('common:students'),
          },
          {
            value: 'staff',
            label: t('common:staff'),
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
