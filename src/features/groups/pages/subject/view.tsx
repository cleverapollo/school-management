import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import useSettings from '../../../../hooks/useSettings';
import Page from '../../../../components/Page';
import { useNavigate, useParams } from 'react-router';
import { useCustomGroupById, useEnrolmentGroupById } from '../../api/general-groups';
import Table from '../../../../components/table/Table';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { useTranslation, TFunction } from '@tyro/i18n';
import { TableColumn, Option } from '../../../../components/table/types';
import OptionButton from '../../../../components/table/OptionButton';
import { GroupMembership } from '@tyro/api';
import { useSubjectGroupById, useSubjectGroups } from '../../api/subject-groups';


interface SubjectExactGroupData extends GroupMembership {
  tech: string;
}

export const subjectOptions: Option<SubjectExactGroupData>[] = [
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
];

const getSubjectGroupColumns = (translate: TFunction<("common" | "authentication")[], undefined, ("common" | "authentication")[]>): TableColumn<SubjectExactGroupData>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'person',
    filter: 'suggest',
    isMandatory: true,
    isSortNeeded: true,
    component: ({ row }) => {
      return (<div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Add Avatar back in when we add value to BE */}
        {/* <Avatar srcSet={columnProps.row.original.avatarUrl} alt={columnProps.row.original.name} style={{ marginRight: '10px' }} /> */}
        {row.original.person?.firstName} {row.original.person?.lastName}
      </div>)
    },
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: (columnProps) => (
      <OptionButton options={subjectOptions} />
    )
  },
];

export default function ViewSubjectGroupPage() {
  const { t } = useTranslation(['common', 'authentication']);
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    if (!groupId) {
      navigate('/404')
    }
  });

  const { data, isLoading } = useSubjectGroupById(groupId);
  const tableData = (data?.members ?? []).map(member => ({ ...member, tech: '' })) as SubjectExactGroupData[];

  const subjectGroupColumns = useMemo(() => getSubjectGroupColumns(t), [t]);
  const title = `${data?.name} ${t('authentication:memberList')}`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs links={[
          {
            name: t('authentication:subjectGroups'),
            href: './..'
          },
          {
            name: data?.name ?? '',
          },
        ]} />
        <Table
          data={tableData}
          columns={subjectGroupColumns}
          isRowSelectionNeeded
        />
      </Container>
    </Page>
  );
}
