import { Box, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { usePreferredNameLayout } from '@tyro/core';
import { ReturnTypeFromUseStudent } from '../../../api/student/students';

export interface AdditionalInfoProps {
  years: ReturnTypeFromUseStudent['yearGroups'];
  classGroup: ReturnTypeFromUseStudent['classGroup'];
  yearGroupLeads: ReturnTypeFromUseStudent['yearGroupLeads'];
  tutors: ReturnTypeFromUseStudent['tutors'];
}

export function AdditionalInfo({
  years,
  classGroup,
  yearGroupLeads,
  tutors,
}: AdditionalInfoProps) {
  const { t } = useTranslation(['people']);
  const { displayNames } = usePreferredNameLayout();

  const additionalInfoList = {
    [t('people:year')]: years?.map((a) => a.shortName).join(', ') || '-',
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
