/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Person } from '@tyro/api';
import useSettings from '../../../../../src/hooks/useSettings';
import Page from '../../../../../src/components/Page';
import { useCustomGroupById } from '../../api/general-groups';
import Table from '../../../../../src/components/table/Table';
import Breadcrumbs from '../../../../../src/components/Breadcrumbs';
import useLocales from '../../../../../src/hooks/useLocales';
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
  translate: (text: any, options?: any) => string
): TableColumn<CustomExactGroupData>[] => [
  {
    columnDisplayName: translate('name'),
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
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    if (!groupId) {
      navigate('/404');
    }
  });

  const { data, isLoading } = useCustomGroupById(groupId);
  const tableData = (data?.members ?? []).map((member) => ({
    ...member,
    tech: '',
  })) as CustomExactGroupData[];

  const customGroupColumns = useMemo(
    () => getCustomGroupColumns(translate),
    [translate]
  );
  const title = !data?.name ? '' : `${data?.name} ${translate('memberList')}`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs
          links={[
            {
              name: translate('customGroups'),
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
