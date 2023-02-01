/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import { Room } from '@tyro/api';
import { Page } from '@tyro/core';
import Table from '../../../../src/components/table/Table';
import { TableColumn } from '../../../../src/components/table/types';
import { useCoreRooms } from '../api/rooms';

const getSubjectColumns = (
  translate: TFunction<
    ('common' | 'rooms')[],
    undefined,
    ('common' | 'rooms')[]
  >
): TableColumn<Room>[] => [
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('rooms:capacity'),
    fieldName: 'capacity',
    filter: 'suggest',
  },
];

export default function Rooms() {
  const { t } = useTranslation(['common', 'subjects', 'rooms']);
  const { data, isLoading } = useCoreRooms();

  const subjectGroupColumns = useMemo(() => getSubjectColumns(t), [t]);

  const rooms: Room[] = data as Room[];
  return (
    <Page title={t('subjects:subject')} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('rooms:rooms')}
        </Typography>
        {rooms && <Table data={rooms} columns={subjectGroupColumns} />}
      </Container>
    </Page>
  );
}
