import { Fragment } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ReturnTypeFromUseTimeTables } from '../../../api/common/timetables';

dayjs.extend(LocalizedFormat);

type TimetableStatusDetailsProps = Partial<
  NonNullable<ReturnTypeFromUseTimeTables['liveStatus']>
>;

export function TimetableStatusDetails({
  lastPublishedDate,
  lessonChanges,
  timetableGroupChanges,
}: TimetableStatusDetailsProps) {
  const { t } = useTranslation(['timetable']);

  const statusDetailsList = {
    [t('timetable:lessonUpdates')]: lessonChanges,
    [t('timetable:groupUpdates')]: timetableGroupChanges,
    [t('timetable:lastPublished')]: lastPublishedDate
      ? dayjs(lastPublishedDate).format('llll')
      : '-',
  };

  const numberOfFields = Object.keys(statusDetailsList).length;

  return (
    <Box
      component="dl"
      display="grid"
      gridTemplateColumns={`repeat(${numberOfFields}, auto)`}
      gridTemplateRows="repeat(2, auto)"
      alignItems="strech"
      sx={{ my: 0 }}
    >
      {Object.entries(statusDetailsList).map(([key, value], index) => (
        <Fragment key={key}>
          <Box
            component="dt"
            gridColumn={(index % numberOfFields) + 1}
            gridRow={1}
            sx={{
              fontSize: '0.75rem',
              px: 2,
              py: 1,
              color: 'slate.600',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {key}
          </Box>
          <Box
            component="dd"
            gridColumn={(index % numberOfFields) + 1}
            gridRow={2}
            sx={{
              fontSize: '0.75rem',
              ml: 0,
              backgroundColor: 'blue.50',
              py: 0.5,
              px: 2,
              my: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(index === 0 && { borderRadius: '17px 0 0 17px' }),
              ...(index === numberOfFields - 1 && {
                borderRadius: '0 17px 17px 0',
                justifyContent: 'flex-start',
              }),
            }}
          >
            {value}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}
