import { useMemo, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import {
  PageContainer,
  PageHeading,
  SearchInput,
  useBreakpointValue,
} from '@tyro/core';
import { TtResourceTimetableViewFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CalendarParty } from '@tyro/calendar';
import { TimetableSearch } from '../components/edit-timetable/timetable-search';
import { useTimetableResourceView } from '../api/resource-view';

export default function EditTimetable() {
  const { t } = useTranslation(['navigation']);
  const [selectedPartys, setSelectedPartys] = useState<CalendarParty[]>([]);
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
    timetableId: 13,
    ...partysForEndpoint,
  });

  console.log({ data });

  return (
    <PageContainer title={t('navigation:management.timetable.editTimetable')}>
      <PageHeading
        title={t('navigation:management.timetable.editTimetable')}
        titleProps={{ variant: 'h3' }}
      />
      <Stack direction={direction} justifyContent="space-between" spacing={2}>
        <TimetableSearch
          selectedPartys={selectedPartys}
          onChangeSelectedPartys={setSelectedPartys}
        />

        <SearchInput size="medium" />
      </Stack>
    </PageContainer>
  );
}
