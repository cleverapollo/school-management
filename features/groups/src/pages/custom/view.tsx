/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Person } from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useNumber } from '@tyro/core';
import useSettings from '../../../../../src/hooks/useSettings';
import Page from '../../../../../src/components/Page';
import { useCustomGroupById } from '../../api/general-groups';
import Table from '../../../../../src/components/table/Table';
import Breadcrumbs from '../../../../../src/components/Breadcrumbs';
import { TableColumn, Option } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';

interface CustomExactGroupData {
  id: string;
  name: string;
  members: Person[];
  tech: string;
}

const customOptions: Option<CustomExactGroupData>[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'view',
    icon: 'edit',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'remove',
    icon: 'delete',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
];

const getCustomGroupColumns = (
  translate: TFunction<
    ('common' | 'authentication')[],
    undefined,
    ('common' | 'authentication')[]
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
        {/* <Avatar srcSet={columnProps.row.original.avatarUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }} /> */}
        {row.original.name}
      </div>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: (columnProps) => <OptionButton options={customOptions} />,
  },
];

export default function ViewCustomGroupPage() {
  const { t } = useTranslation(['common', 'authentication']);
  const { themeStretch } = useSettings();
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
    : `${data?.name} ${t('authentication:memberList')}`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs
          links={[
            {
              name: t('authentication:customGroups'),
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
