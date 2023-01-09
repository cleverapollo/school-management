import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import useSettings from '../../../../hooks/useSettings';
import Page from '../../../../components/Page';
import { useNavigate, useParams } from 'react-router';
import { useCustomGroupById, useEnrolmentGroupById } from '../../api/general-groups';
import Table from '../../../../components/table/Table';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { useTranslation } from '@tyro/i18n';
import { TableColumn, Option } from '../../../../components/table/types';
import OptionButton from '../../../../components/table/OptionButton';
import { GeneralGroupMember } from '@tyro/api';
import { TFunction } from 'i18next';


interface EnrolmentExactGroupData extends GeneralGroupMember {
  tech: string;
}

export const enrolmentOptions: Option<EnrolmentExactGroupData>[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => { e.stopPropagation() },
  },
  {
    text: 'view profile',
    icon: 'edit',
    action: (e) => { e.stopPropagation() },
  },
  {
    text: 'view timetable',
    icon: 'edit',
    action: (e) => { e.stopPropagation() },
  },
];

const getEnrolmentGroupColumns = (translate: TFunction): TableColumn<EnrolmentExactGroupData>[] => [
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
      <OptionButton options={enrolmentOptions} />
    )
  },
];

export default function ViewEnrolmentGroupPage() {
  const { t } = useTranslation(['common']);
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    if (!groupId) {
      navigate('/404')
    }
  });

  const { data, isLoading } = useEnrolmentGroupById(groupId);
  const tableData = (data?.members ?? []).map(member => ({ ...member, tech: '' })) as EnrolmentExactGroupData[];

  const enrolmentGroupColumns = useMemo(() => getEnrolmentGroupColumns(t), [t]);
  const title = `${data?.name} ${t('common:memberList')}`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs links={[
          {
            name: t('common:enrolmentGroups'),
            href: './..'
          },
          {
            name: data?.name ?? '',
          },
        ]} />
        <Table
          data={tableData}
          columns={enrolmentGroupColumns}
          isRowSelectionNeeded
        />
      </Container>
    </Page>
  );
}
