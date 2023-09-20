import {
  Box,
  FormHelperText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  usePreferredNameLayout,
  Avatar,
  SearchInput,
  useDebouncedValue,
} from '@tyro/core';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { CheckmarkIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useMemo, useState } from 'react';
import { ReturnTypeFromUseCoverLookup } from '../../../api/staff-work-cover-lookup';

dayjs.extend(duration);
interface CoverSelectionTableProps<TField extends FieldValues> {
  staffList: ReturnTypeFromUseCoverLookup['staff'];
  controlProps: UseControllerProps<TField>;
}

const toHoursMin = (minutes: number | undefined | null): string => {
  if (minutes == null) {
    return '';
  }
  const duration = dayjs.duration(minutes, 'minutes').format('HH:mm');
  return `(${duration})`;
};
export const CoverSelectionTable = <TField extends FieldValues>({
  staffList,
  controlProps,
}: CoverSelectionTableProps<TField>) => {
  const { t } = useTranslation(['common', 'substitution']);
  const { displayName } = usePreferredNameLayout();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController(controlProps);


  return (
    <Box>
      <TableContainer
        sx={{
          maxHeight: '40vh',
          minHeight: 200,
          border: '1px solid',
          borderColor: error ? 'error.main' : 'slate.300',
          borderRadius: 1,

          '& th:first-of-type span': {
            fontWeight: '600',
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('common:name')}</TableCell>
              <TableCell>{t('substitution:sAndSWeek')}</TableCell>
              <TableCell>{t('substitution:sAndSYear')}</TableCell>
              <TableCell>{t('substitution:casualWeek')}</TableCell>
              <TableCell>{t('substitution:fullTimePeriods')}</TableCell>
              <TableCell>{t('common:class')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map(
              ({
                staff: { person, extensions },
                clashingEvents,
                substitutionStats,
              }) => {
                const { substitutionSummary, timetableSummary } =
                  extensions ?? {};
                const {
                  substitutionCountThisWeek,
                  substitutionTimeThisWeekMinutes,
                  substitutionCountThisYear,
                  substitutionTimeThisYearMinutes,
                } = substitutionSummary ?? {};
                const name = displayName(person);

                const isSelected = person.partyId === value?.partyId;

                return (
                  <TableRow
                    key={person.partyId}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onChange(person)}
                    role="checkbox"
                    aria-checked={isSelected}
                    selected={isSelected}
                    tabIndex={0}
                  >
                    <TableCell component="th">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box position="relative">
                          <Avatar
                            name={name}
                            src={person.avatarUrl}
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: '0.625rem',
                            }}
                          />
                          <Box
                            aria-hidden
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              width: 24,
                              height: 24,
                              opacity: isSelected ? 1 : 0,
                              color: 'white',
                              transitionTimingFunction:
                                'cubic-bezier(0.4, 0, 0.2, 1)',
                              transitionDuration: '150ms',
                              transitionProperty: 'opacity',
                              '& svg': {
                                width: 20,
                                height: 20,
                                '& path': {
                                  strokeWidth: 2,
                                },
                              },
                            }}
                          >
                            <CheckmarkIcon />
                          </Box>
                        </Box>
                        <span>{name}</span>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {substitutionStats.sandsWeekCount > 0 &&
                        `${substitutionStats.sandsWeekCount} ${toHoursMin(
                          substitutionStats.sandsWeekMinutes
                        )}`}
                    </TableCell>
                    <TableCell>
                      {substitutionStats.sandsYearCount > 0 &&
                        `${substitutionStats.sandsYearCount} ${toHoursMin(
                          substitutionStats.sandsWeekMinutes
                        )}`}
                    </TableCell>
                    <TableCell>
                      {substitutionStats.casualWeekCount > 0 &&
                        `${substitutionStats.casualWeekCount} ${toHoursMin(
                          substitutionStats.casualWeekMinutes
                        )}`}
                    </TableCell>
                    <TableCell>
                      {timetableSummary?.fulltimePeriods ?? ''}
                    </TableCell>
                    <TableCell>{clashingEvents?.join(', ')}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {error && (
        <FormHelperText error variant="outlined">
          {error.message}
        </FormHelperText>
      )}
    </Box>
  );
};
