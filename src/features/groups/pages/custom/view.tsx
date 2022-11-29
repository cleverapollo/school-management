import { useEffect, useMemo } from 'react';
import { Avatar, Container, Typography } from '@mui/material';
import useSettings from '../../../../hooks/useSettings';
import Page from '../../../../components/Page';
import { useNavigate, useParams } from 'react-router';
import { useCustomGroupById } from '../../api/general-groups';
import Table from '../../../../components/table/Table';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import useLocales from '../../../../hooks/useLocales';
import { TableColumn, Option } from '../../../../components/table/types';
import OptionButton from '../../../../components/table/OptionButton';
import { GeneralGroupMember } from '@tyro/api';


interface CustomExactGroupData extends GeneralGroupMember {
  tech: string;
}

const customOptions: Option[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => { e.stopPropagation() },
  },
  {
    text: 'view',
    icon: 'edit',
    action: (e) => { e.stopPropagation() },
  },
  {
    text: 'remove',
    icon: 'delete',
    action: (e) => { e.stopPropagation() },
  },
];

const getCustomGroupColumns = (translate: (text: any, options?: any) => never): TableColumn<CustomExactGroupData>[] => [
  {
    columnDisplayName: translate('name'),
    fieldName: 'firstName',
    filter: 'suggest',
    isMandatory: true,
    isSortNeeded: true,
    component: ({ row }) => {
      return (<div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Add Avatar back in when we add value to BE */}
        {/* <Avatar srcSet={columnProps.row.original.avatarUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }} /> */}
        {row.original.firstName} {row.original.lastName}
      </div>)
    },
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: (columnProps) => (
      <OptionButton options={customOptions} />
    )
  },
];

export default function ViewCustomGroupPage() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    if (!groupId) {
      navigate('/404')
    }
  });

  const { data, isLoading } = useCustomGroupById(groupId);
  const tableData = (data?.members ?? []).map(member => ({...member, tech: ''})) as CustomExactGroupData[];

  const customGroupColumns = useMemo(() => getCustomGroupColumns(translate), [translate]);
  const title = `${ data?.name } ${ translate('memberList') }`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs links={[
          {
            name: translate('customGroups'),
            href: './..'
          },
          {
            name: data?.name ?? '',
          },
        ]} />
        <Table
          data={tableData}
          columns={customGroupColumns}
          isRowSelectionNeeded
        />
      </Container>
    </Page>
  );
}
