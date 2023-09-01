import { useEffect, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useBreakpointValue } from '@tyro/core';
import { SearchType, TtResourceTimetableViewFilter } from '@tyro/api';
import { CalendarParty } from '@tyro/calendar';
import { useYearGroups } from '@tyro/groups';
import { TimetableSearch } from '../../components/edit-timetable/timetable-search';
import { useTimetableResourceView } from '../../api/edit-timetable/resource-view';
import { ResourcesTable } from '../../components/edit-timetable/resources-table';
import { useLiveTimetableId } from '../../api/common/timetables';

export default function EditTimetable() {
  const [selectedPartys, setSelectedPartys] = useState<CalendarParty[]>([]);
  const { data: liveTimetableId = 0 } = useLiveTimetableId();
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
    timetableId: liveTimetableId,
    ...partysForEndpoint,
  });
  const { data: yearGroups } = useYearGroups();

  useEffect(() => {
    const sixthYearGroup = yearGroups?.find(
      ({ yearGroupId }) => yearGroupId === 6
    );

    if (sixthYearGroup) {
      setSelectedPartys([
        {
          partyId: sixthYearGroup.yearGroupEnrollmentPartyId,
          text: sixthYearGroup.name,
          avatarUrl: undefined,
          type: SearchType.YearGroupEnrollment,
        },
      ]);
    }
  }, [yearGroups]);

  return (
    <>
      <Stack direction={direction} justifyContent="space-between" spacing={2}>
        <TimetableSearch
          selectedPartys={selectedPartys}
          onChangeSelectedPartys={setSelectedPartys}
        />
      </Stack>
      {data && (
        <ResourcesTable
          timetableId={liveTimetableId}
          resources={data}
          selectedParties={selectedPartys}
        />
      )}
    </>
  );
}
