import { useEffect, useMemo, useState } from 'react';
import { Card, Stack, Typography } from '@mui/material';
import {
  ComingSoonIllustration,
  PageContainer,
  PageHeading,
  useBreakpointValue,
} from '@tyro/core';
import { SearchType, TtResourceTimetableViewFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { CalendarParty } from '@tyro/calendar';
import { useYearGroups } from '@tyro/groups';
import { TimetableSearch } from '../components/edit-timetable/timetable-search';
import { useTimetableResourceView } from '../api/resource-view';
import { ResourcesTable } from '../components/edit-timetable/resources-table';
import { useTimetables } from '../api/timetables';

export default function EditTimetable() {
  const { t } = useTranslation(['navigation', 'timetable']);
  const [selectedPartys, setSelectedPartys] = useState<CalendarParty[]>([]);
  const { data: liveTimetables } = useTimetables({ liveTimetable: true });
  const activeTimetableId = liveTimetables?.[0]?.timetableId ?? 0;
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
    timetableId: activeTimetableId,
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
    <PageContainer
      title={t('navigation:management.timetable.editTimetable')}
      maxWidth={false}
      sx={{ maxWidth: 1980 }}
    >
      <PageHeading
        title={t('navigation:management.timetable.editTimetable')}
        titleProps={{ variant: 'h3' }}
      />
      {activeTimetableId !== 0 ? (
        <>
          <Stack
            direction={direction}
            justifyContent="space-between"
            spacing={2}
          >
            <TimetableSearch
              selectedPartys={selectedPartys}
              onChangeSelectedPartys={setSelectedPartys}
            />
          </Stack>
          {data && (
            <ResourcesTable timetableId={activeTimetableId} resources={data} />
          )}
        </>
      ) : (
        <Card sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Stack
            spacing={4}
            justifyContent="center"
            alignItems="center"
            my={10}
            mx={4}
          >
            <ComingSoonIllustration
              sx={{
                width: '100%',
                maxWidth: 320,
              }}
            />
            <Typography component="h2" variant="subtitle1" textAlign="center">
              {t('timetable:noTimetablePublishedForYear')}
            </Typography>
          </Stack>
        </Card>
      )}
    </PageContainer>
  );
}
