import { Box, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { GeneralGroup, Person, Student, YearGroupEnrollment } from '@tyro/api';
import { ReturnTypeFromUseStudent } from '../../../api/students';
/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { displayNames } from '../../../../../../src/utils/nameUtils';

export interface AdditionalInfoProps {
  year: ReturnTypeFromUseStudent['yearGroups'];
  classGroup: ReturnTypeFromUseStudent['classGroup'];
  yearGroupLeads: ReturnTypeFromUseStudent['yearGroupLeads'];
  tutors: ReturnTypeFromUseStudent['tutors'];
}

export function AdditionalInfo({
  year,
  classGroup,
  yearGroupLeads,
  tutors,
}: AdditionalInfoProps) {
  const { t } = useTranslation(['people']);

  const additionalInfoList = {
    [t('people:year')]: year?.map((a) => a.shortName).join(', ') || '-',
    [t('people:class')]: classGroup?.name || '-',
    [t('people:yearHead')]: displayNames(yearGroupLeads) || '-',
    [t('people:tutor')]: displayNames(tutors) || '-',
  };

  return (
    <Stack component="dl" direction="row" sx={{ my: 0 }}>
      {Object.entries(additionalInfoList).map(([label, value], index) => (
        <Stack key={label}>
          <Box
            component="dt"
            sx={{
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
              color: 'slate.600',
              minHeight: 34,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {label}
          </Box>
          <Box
            component="dd"
            sx={{
              fontSize: '0.75rem',
              ml: 0,
              py: 1,
              px: 2,
              ...(index < 2 && {
                textAlign: 'center',
              }),
            }}
          >
            {value}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
