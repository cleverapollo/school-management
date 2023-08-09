import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { usePreferredNameLayout } from '@tyro/core';
import { useMemo } from 'react';
import { ReturnTypeOfUseCoverTable } from '../../../hooks/use-cover-table';
import { getAdditionalStaff } from '../../../utils/cover-utils';

interface AdditionalTeacherListProps {
  eventsMap: ReturnTypeOfUseCoverTable['selectedEventsMap'] | null;
}

export function AdditionalTeacherList({
  eventsMap,
}: AdditionalTeacherListProps) {
  const { t } = useTranslation(['common', 'substitution']);
  const { displayNames } = usePreferredNameLayout();
  const numberOfSelectedEvents = eventsMap?.size ?? 0;
  const additionalTeachersLists = useMemo(
    () =>
      Array.from(eventsMap?.values() ?? [])
        .map((eventInfo) => ({
          id: eventInfo.event.eventId,
          name: eventInfo.event.name,
          additionalTeachers: getAdditionalStaff(eventInfo),
        }))
        .filter(({ additionalTeachers }) => additionalTeachers.length),
    [eventsMap]
  );
  const hasAdditionalTeachers = Boolean(additionalTeachersLists.length);

  if (!hasAdditionalTeachers) return null;

  if (numberOfSelectedEvents > 1) {
    return (
      <Box component="dl" m={0}>
        <Typography component="dt" variant="body2">
          {t('common:additionalTeacher', {
            count: 2,
          })}
          :
        </Typography>
        {additionalTeachersLists.map(({ id, name, additionalTeachers }) => (
          <Typography component="dd" variant="caption" key={id} pl={1}>
            {name}:{' '}
            <Box component="span" color="text.secondary">
              {displayNames(additionalTeachers)}
            </Box>
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Typography variant="body2">
      {t('common:additionalTeacher', {
        count: additionalTeachersLists[0].additionalTeachers.length,
      })}
      :{' '}
      <Box component="span" color="text.secondary">
        {displayNames(additionalTeachersLists[0].additionalTeachers)}
      </Box>
    </Typography>
  );
}
