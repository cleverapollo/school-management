/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Person } from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useNumber, Page, Breadcrumbs } from '@tyro/core';
import { useEnrolmentGroupById } from '../../api/general-groups';
import Table from '../../../../../src/components/table/Table';
import { TableColumn, Option } from '../../../../../src/components/table/types';
import OptionButton from '../../../../../src/components/table/OptionButton';

interface EnrolmentExactGroupData {
  id: string;
  name: string;
  members: Person[];
  tech: string;
}

export const enrolmentOptions: Option<EnrolmentExactGroupData>[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'view profile',
    icon: 'edit',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
  {
    text: 'view timetable',
    icon: 'edit',
    action: (e: MouseEvent) => {
      e.stopPropagation();
    },
  },
];

const getEnrolmentGroupColumns = (
  translate: TFunction<
    ('common' | 'authentication')[],
    undefined,
    ('common' | 'authentication')[]
  >
): TableColumn<EnrolmentExactGroupData>[] => [
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
    component: (columnProps) => <OptionButton options={enrolmentOptions} />,
  },
];

export default function ViewEnrolmentGroupPage() {
  const { t } = useTranslation(['common', 'authentication']);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);

  useEffect(() => {
    if (!groupIdAsNumber) {
      navigate('/404');
    }
  }, [groupIdAsNumber]);

  const { data, isLoading } = useEnrolmentGroupById(groupIdAsNumber);
  const tableData = (data?.members ?? []).map((member) => ({
    ...member,
    tech: '',
  })) as EnrolmentExactGroupData[];

  const enrolmentGroupColumns = useMemo(() => getEnrolmentGroupColumns(t), [t]);
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
              name: t('authentication:enrolmentGroups'),
              href: './..',
            },
            {
              name: data?.name ?? '',
            },
          ]}
        />
        <Table
          data={tableData}
          columns={enrolmentGroupColumns}
          isRowSelectionNeeded
        />
      </Container>
    </Page>
  );
}
