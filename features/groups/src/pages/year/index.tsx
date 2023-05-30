import { Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableAvatar,
  usePreferredNameLayout,
} from '@tyro/core';
import {
  useYearGroups,
  ReturnTypeFromUseYearGroups,
} from '../../api/year-groups';

const getYearGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseYearGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    lockVisible: true,
    sort: 'asc',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseYearGroups>) =>
      data ? (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.yearGroupEnrollmentPartyId ?? ''}`}
          avatarUrl={undefined}
          AvatarProps={{
            sx: {
              borderRadius: 1,
            },
          }}
        />
      ) : null,
  },
  {
    field: 'members',
    headerName: t('common:members'),
    filter: true,
  },
  {
    headerName: t('common:yearhead'),
    field: 'yearGroupLeads',
    enableRowGroup: true,
    valueGetter: ({ data }) => displayNames(data?.yearGroupLeads),
  },
];

export default function YearGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { displayNames } = usePreferredNameLayout();
  const { data: yearGroupData } = useYearGroups();

  const yearGroupColumns = useMemo(
    () => getYearGroupsColumns(t, displayNames),
    [t, displayNames]
  );

  return (
    <Page title={t('groups:yearGroups')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('groups:yearGroups')}
        </Typography>
        <Table
          rowData={yearGroupData ?? []}
          columnDefs={yearGroupColumns}
          getRowId={({ data }) => String(data?.yearGroupEnrollmentPartyId)}
        />
      </Container>
    </Page>
  );
}
