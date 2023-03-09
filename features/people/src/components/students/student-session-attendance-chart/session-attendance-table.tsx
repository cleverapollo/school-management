import { Box, Stack, Typography } from '@mui/material';
import {
  ChartDefinition,
  ChartRendererInternalProps,
  DrillDownLocator,
  ResultSet,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';

const transformData = (resultSet: ResultSet) => {
  const total = resultSet
    .tablePivot()
    .reduce(
      (acc, row) => acc + Number(row['OutputSessionsAttendance.count']),
      0
    );

  const rows = resultSet.tablePivot().map((row) => ({
    name: row['OutputSessionsAttendance.absenceType'] as string,
    count: Number(row['OutputSessionsAttendance.count']),
    percent: Number(
      (Number(row['OutputSessionsAttendance.count']) / total) * 100
    ).toFixed(2),
    color: row['OutputSessionsAttendance.colourAbsenceType'] as string,
  }));

  return {
    total,
    rows,
  };
};

const DisplayComponent = ({
  resultSet,
  onClick,
  emptyState,
}: ChartRendererInternalProps) => {
  const { t } = useTranslation(['attendance']);
  const transformed = useMemo(() => transformData(resultSet), [resultSet]);

  if (emptyState && transformed?.total === 0) {
    return emptyState;
  }

  return (
    <Stack>
      <Typography variant="subtitle1" component="h4" sx={{ mb: 3 }}>
        {t('attendance:totalDays', { count: transformed?.total ?? 0 })}
      </Typography>
      <Box
        component="table"
        sx={{
          tr: {
            transitionProperty: 'opacity',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '200ms',
          },
          '&:hover tr': {
            opacity: 0.5,
          },
          '&:hover tr:hover': {
            opacity: 1,
          },
          th: {
            textAlign: 'left',
            color: 'text.secondary',
            fontWeight: 400,
          },
          td: {
            textAlign: 'right',
            fontWeight: 700,
            px: 4,
          },
          'td:nth-of-type(2)': {
            color: 'text.secondary',
          },
        }}
      >
        <tbody>
          {transformed.rows.map((row, index) => (
            <tr
              key={row.name}
              onClick={(event) => {
                if (typeof onClick === 'function') {
                  onClick(event, row, {
                    dataPointIndex: index,
                    selectedDataPoints: [index],
                    seriesIndex: 0,
                  });
                }
              }}
            >
              <th>
                <Stack direction="row" alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: 1,
                      display: 'inline-block',
                      backgroundColor: `${row.color}.500`,
                      mr: 1,
                    }}
                  />
                  {row.name}
                </Stack>
              </th>
              <td>{row.count}</td>
              <td>({row.percent}%)</td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Stack>
  );
};

const drilldownLocationFunction = (
  resultSet: ResultSet,
  a: any,
  b: any,
  c: any
): any => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const index = c.dataPointIndex as number;
  const xfilterValues = resultSet.chartPivot()[index].xValues;

  const locator = {
    xValues: xfilterValues,
    yValues: [],
  } as DrillDownLocator;
  return resultSet.drillDown(locator);
};

export const SessionAttendanceTable = (): ChartDefinition => ({
  component: (props) => <DisplayComponent {...props} />,
  drillDownQuery: drilldownLocationFunction,
});
