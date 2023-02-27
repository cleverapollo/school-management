/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Person } from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useNumber, Page, Breadcrumbs } from '@tyro/core';
import { useCustomGroupById } from '../../api/general-groups';
import Table from '../../../../../src/components/table/Table';
import { TableColumn, Option } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';

interface CustomExactGroupData {
  id: string;
  name: string;
  members: Person[];
  tech: string;
}

export const getCustomOptions = (
  translate: TFunction<('common')[], undefined, ('common')[]>,
): Option<CustomExactGroupData>[] => ([
  {
    text: translate('common:actions.notify'),
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: translate('common:actions.view'),
    icon: 'edit',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: translate('common:actions.remove'),
    icon: 'delete',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
]);

const getCustomGroupColumns = (
  translate: TFunction<
    ('common' | 'groups')[],
    undefined,
    ('common' | 'groups')[]
  >
): TableColumn<CustomExactGroupData>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
    isSortNeeded: true,
    component: ({ row }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Add Avatar back in when we add value to BE */}
        {/* <Avatar srcSet={columnProps.row.original.avatarUrl} name={columnProps.row.original.name} style={{ marginRight: '10px' }} /> */}
        {row.original.name}
      </div>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: (columnProps) => <OptionButton options={getCustomOptions(translate)} />,
  },
];

export default function ViewCustomGroupPage() {
  const { t } = useTranslation(['common', 'groups']);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);

  useEffect(() => {
    if (!groupIdAsNumber) {
      navigate('/404');
    }
  });

  const { data, isLoading } = useCustomGroupById(groupIdAsNumber);
  const tableData = (data?.members ?? []).map((member) => ({
    ...member,
    tech: '',
  })) as CustomExactGroupData[];

  const customGroupColumns = useMemo(() => getCustomGroupColumns(t), [t]);
  const title = !data?.name
    ? ''
    : `${data?.name} ${t('groups:memberList')}`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs
          links={[
            {
              name: t('groups:customGroups'),
              href: './..',
            },
            {
              name: data?.name ?? '',
            },
          ]}
        />
        <Table
          data={tableData}
          columns={customGroupColumns}
          isRowSelectionNeeded
        />
      </Container>
    </Page>
  );
}