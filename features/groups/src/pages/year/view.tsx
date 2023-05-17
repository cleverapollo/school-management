import { useMemo } from 'react';
import { Container } from '@mui/material';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  useNumber,
  Page,
  Table,
  GridOptions,
  TablePersonAvatar,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  PageHeading,
  ReturnTypeDisplayNames,
} from '@tyro/core';
import { getPersonProfileLink } from '../../utils/get-person-profile-link';
import { useYearGroupById } from '../../api/year-groups';

type MembersReturnTypeFromUseYearGroupsById = NonNullable<
  NonNullable<ReturnType<typeof useYearGroupById>['data']>['students']
>[number];

const getYearGroupColumns = (
  t: TFunction<('common' | 'groups')[], undefined, ('common' | 'groups')[]>,
  displayName: ReturnTypeDisplayName,
  displayNames: ReturnTypeDisplayNames
): GridOptions<MembersReturnTypeFromUseYearGroupsById>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueFormatter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<MembersReturnTypeFromUseYearGroupsById, any>) => (
      <TablePersonAvatar
        person={data?.person}
        to={getPersonProfileLink(data?.person)}
      />
    ),
    lockVisible: true,
  },
  {
    field: 'classGroup.name',
    headerName: t('common:class'),
    filter: true,
  },
  {
    headerName: t('common:tutor'),
    field: 'tutors',
    valueFormatter: ({ data }) => displayNames(data?.tutors),
  },
];

export default function ViewYearGroupPage() {
  const { t } = useTranslation(['common', 'groups']);
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);
  const { displayName, displayNames } = usePreferredNameLayout();

  const { data: groupData } = useYearGroupById(groupIdAsNumber);

  const yearGroupColumns = useMemo(
    () => getYearGroupColumns(t, displayName, displayNames),
    [t, displayName, displayNames]
  );
  const title = t('groups:namedMemberList', {
    groupName: groupData?.name ?? '',
  });

  return (
    <Page title={title}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 3,
        }}
      >
        <PageHeading
          title={title}
          breadcrumbs={{
            links: [
              {
                name: t('groups:yearGroups'),
                href: './..',
              },
              {
                name: groupData?.name ?? '',
              },
            ],
          }}
        />
        <Table
          rowData={groupData?.students ?? []}
          columnDefs={yearGroupColumns}
          getRowId={({ data }) => String(data?.partyId)}
        />
      </Container>
    </Page>
  );
}
