import { useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { PageContainer, PageHeading, useBreakpointValue } from '@tyro/core';
import { TtResourceTimetableViewFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CalendarParty } from '@tyro/calendar';
import { TimetableSearch } from '../components/edit-timetable/timetable-search';
import { useTimetableResourceView } from '../api/resource-view';
import { ResourcesTable } from '../components/edit-timetable/resources-table';

export default function EditTimetable() {
  const { t } = useTranslation(['navigation']);
  const [selectedPartys, setSelectedPartys] = useState<CalendarParty[]>([]);
  const timetableId = 20;
  const direction = useBreakpointValue<'column' | 'row'>({
    base: 'column',
    sm: 'row',
  });
  const partysForEndpoint = useMemo(
    () =>
      selectedPartys.reduce<
        Pick<TtResourceTimetableViewFilter, 'partyIds' | 'roomIds'>
      >(
        (acc, party) => {
          // TODO: Filter rooms when added to endpoint
          acc.partyIds.push(party.partyId);
          return acc;
        },
        { partyIds: [], roomIds: [] }
      ),
    [selectedPartys]
  );

  const { data } = useTimetableResourceView({
    timetableId,
    ...partysForEndpoint,
  });

  return (
    <PageContainer
      title={t('navigation:management.timetable.editTimetable')}
      maxWidth={false}
      sx={{ maxWidth: 1980 }}
    >
      <PageHeading
        title={t('navigation:management.timetable.editTimetable')}
        titleProps={{ variant: 'h3' }}
      />
      <Stack direction={direction} justifyContent="space-between" spacing={2}>
        <TimetableSearch
          selectedPartys={selectedPartys}
          onChangeSelectedPartys={setSelectedPartys}
        />
      </Stack>
      {data && <ResourcesTable timetableId={timetableId} resources={data} />}
    </PageContainer>
  );
}
