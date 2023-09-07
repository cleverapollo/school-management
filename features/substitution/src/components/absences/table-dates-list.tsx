import { Fragment } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { getLocaleTimestamp } from '@tyro/core';
import { Box } from '@mui/material';
import { ReturnTypeFromUseStaffWorkAbsences } from '../../api/staff-work-absences';

dayjs.extend(LocalizedFormat);

interface TableDatesListProps {
  dates: ReturnTypeFromUseStaffWorkAbsences['dates'];
}

function mapDatesToReadableList(
  dates: TableDatesListProps['dates'],
  t: TFunction<'substitution'[]>
) {
  return dates?.map(
    (
      {
        continuousStartDate,
        continuousEndDate,
        individualDates,
        partialAbsence,
        leavesAt,
        returnsAt,
      },
      index
    ) => {
      const suffix =
        index + 1 !== dates.length ? (
          <>
            ,<br />
          </>
        ) : (
          ''
        );

      if (continuousStartDate && continuousEndDate) {
        const rangeString = partialAbsence
          ? t('substitution:rangeOfPartialDays', {
              startDate: dayjs(continuousStartDate).format('L'),
              endDate: dayjs(continuousEndDate).format('L'),
              startTime: getLocaleTimestamp(leavesAt),
              endTime: getLocaleTimestamp(returnsAt),
            })
          : t('substitution:rangeOfFullDays', {
              startDate: dayjs(continuousStartDate).format('L'),
              endDate: dayjs(continuousEndDate).format('L'),
            });

        return {
          key: `${continuousStartDate}-${continuousEndDate}`,
          value: rangeString,
          suffix,
        };
      }

      const mappedIndividualDates = individualDates
        ?.map((date) => dayjs(date).format('L'))
        .join(', ');
      const datesString = partialAbsence
        ? t('substitution:datesPartialDay', {
            dates: mappedIndividualDates,
            startTime: getLocaleTimestamp(leavesAt),
            endTime: getLocaleTimestamp(returnsAt),
          })
        : mappedIndividualDates;

      return {
        key: mappedIndividualDates,
        value: datesString,
        suffix,
      };
    }
  );
}

export function getDateListString(
  dates: TableDatesListProps['dates'],
  t: TFunction<'substitution'[]>
) {
  const mappedCellValues = mapDatesToReadableList(dates, t);
  return mappedCellValues.map(({ value }) => value).join(', ');
}

export function TableDatesList({ dates }: TableDatesListProps) {
  const { t } = useTranslation(['substitution']);

  const mappedCellValues = mapDatesToReadableList(dates, t);

  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        lineHeight: '1.5',
        py: 1.5,
      }}
    >
      {mappedCellValues.map(({ key, value, suffix }) => (
        <Fragment key={key}>
          {value}
          {suffix}
        </Fragment>
      ))}
    </Box>
  );
}
