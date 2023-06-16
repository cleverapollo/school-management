import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { SearchInput } from '@tyro/core';
import { useState } from 'react';
import { ReturnTypeFromUseTimetableResourceView } from '../../api/resource-view';
import { useResourceTable } from '../../hooks/use-resource-table';
import { ResourceTableCard } from './resource-table-card';

interface ResourcesTableProps {
  resources: ReturnTypeFromUseTimetableResourceView;
}

export function ResourcesTable({ resources }: ResourcesTableProps) {
  const { t } = useTranslation(['timetable']);
  const [searchValue, setSearchValue] = useState('');

  const {
    gridIds,
    days,
    periods,
    getResourcesByTimeslotId,
    isLessonSelected,
    toggleLessonSelection,
  } = useResourceTable(resources);

  return (
    <Card>
      <Stack direction="row" justifyContent="space-between" spacing={2} p={2}>
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Stack>
      <TableContainer>
        <Table
          stickyHeader
          sx={({ palette }) => ({
            '& th, & td': {
              border: `1px solid ${palette.divider}`,
              p: 1,
            },
            '& thead th': {
              backgroundColor: 'white',
              color: 'text.primary',
              fontWeight: 600,
              backgroundImage: 'none',
              textAlign: 'center',
            },
            '& tbody td, & tbody th': {
              verticalAlign: 'top',
            },
            borderCollapse: 'collapse',
            'th:first-of-type': {
              position: 'sticky',
              left: 0,
              zIndex: 1,
              backgroundColor: 'white',
            },
            // Remove edge border
            '& th:first-of-type': {
              borderLeft: 'none',
            },
            '& th:last-child, & td:last-child': {
              borderRight: 'none',
            },
            '& tbody tr:last-child td, & tbody tr:last-child th': {
              borderBottom: 'none',
            },
          })}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              {periods.map((period) => (
                <TableCell key={JSON.stringify(period)}>
                  {t(`timetable:periodNumber`, {
                    number: period,
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell component="th" scope="row">
                  {dayjs().set('day', day).format('ddd')}
                </TableCell>
                {periods.map((period) => {
                  const resourcesForPeriod = gridIds.reduce(
                    (acc, gridIdx) => [
                      ...acc,
                      ...getResourcesByTimeslotId({
                        gridIdx,
                        dayIdx: day,
                        periodIdx: period,
                      }),
                    ],
                    [] as ReturnType<typeof getResourcesByTimeslotId>
                  );
                  return (
                    <TableCell key={period}>
                      <Stack spacing={1}>
                        {resourcesForPeriod.map((resource) => (
                          <ResourceTableCard
                            key={JSON.stringify(resource.id)}
                            resource={resource}
                            multipleGrids={gridIds.length > 1}
                            searchValue={searchValue}
                            isLessonSelected={isLessonSelected}
                            toggleLessonSelection={toggleLessonSelection}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
