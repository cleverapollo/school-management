import { Fragment, useMemo } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { usePersonStatus } from '../../../api/person/status';

interface CurrentLocationProps {
  staffPartyId: number | undefined;
}

export function CurrentLocation({ staffPartyId }: CurrentLocationProps) {
  const { t } = useTranslation(['people']);
  const { data } = usePersonStatus(staffPartyId);
  const currentLocationList = useMemo(() => {
    const room = data?.currentLocation?.room
      ?.map((a) => a?.name)
      .find((a) => true);

    return {
      [t('people:currentLocation')]: room ?? '-',
      [t('people:currentLesson')]: data?.currentLocation?.lesson ?? '-',
    };
  }, [data, t]);
  return (
    <Box
      component="dl"
      display="grid"
      gridTemplateColumns="repeat(3, auto)"
      gridTemplateRows="repeat(2, 1fr)"
      alignItems="strech"
      sx={{ my: 0 }}
    >
      {Object.entries(currentLocationList).map(([key, value], index) => (
        <Fragment key={key}>
          <Box
            component="dt"
            gridColumn={(index % 2) + 1}
            gridRow={1}
            sx={{
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
              color: 'slate.600',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {key}
          </Box>
          <Box
            component="dd"
            gridColumn={(index % 2) + 1}
            gridRow={2}
            sx={{
              fontSize: '0.75rem',
              ml: 0,
              backgroundColor: 'blue.50',
              py: 0.5,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              ...(index === 0 && { borderRadius: '17px 0 0 17px' }),
              ...(index === 1 && {
                borderRadius: '0 17px 17px 0',
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
