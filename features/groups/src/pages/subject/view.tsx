/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { GroupMembership } from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useNumber, Page, Breadcrumbs } from '@tyro/core';
import Table from '../../../../../src/components/table/Table';
import { TableColumn, Option } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';
import { useSubjectGroupById } from '../../api/subject-groups';

interface SubjectExactGroupData extends GroupMembership {
  tech: string;
}

export const subjectOptions: Option<SubjectExactGroupData>[] = [
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
];

const getSubjectGroupColumns = (
  translate: TFunction<
    ('common' | 'authentication')[],
    undefined,
    ('common' | 'authentication')[]
  >
): TableColumn<SubjectExactGroupData>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'person',
    filter: 'suggest',
    isMandatory: true,
    isSortNeeded: true,
    component: ({ row }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Add Avatar back in when we add value to BE */}
        {/* <Avatar srcSet={columnProps.row.original.avatarUrl} name={columnProps.row.original.name} style={{ marginRight: '10px' }} /> */}
        {row.original.person?.firstName} {row.original.person?.lastName}
      </div>
    ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: (columnProps) => <OptionButton options={subjectOptions} />,
  },
];

export default function ViewSubjectGroupPage() {
  const { t } = useTranslation(['common', 'authentication']);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);

  useEffect(() => {
    if (!groupId) {
      navigate('/404');
    }
  });

  const { data, isLoading } = useSubjectGroupById(groupIdAsNumber);
  const tableData = (data?.members ?? []).map((member) => ({
    ...member,
    tech: '',
  })) as SubjectExactGroupData[];

  const subjectGroupColumns = useMemo(() => getSubjectGroupColumns(t), [t]);
  const title = !data?.name
    ? ''
    : `${data?.name} ${t('authentication:memberList')}`;

  return (
    <Page title={title} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {title}
        </Typography>
        <Breadcrumbs
          links={[
            {
              name: t('authentication:subjectGroups'),
              href: './..',
            },
            {
              name: data?.name ?? '',
            },
          ]}
        />
        <Table
          data={tableData}
          columns={subjectGroupColumns}
          isRowSelectionNeeded
        />
      </Container>
    </Page>
  );
}
