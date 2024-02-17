import { useMemo } from 'react';
import { getNumber } from '@tyro/core';
import groupBy from 'lodash/groupBy';
import { useParams } from 'react-router-dom';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useOptionsSetup } from '../../api/options';
import { useOptionsPreferences } from '../../api/options-preferences';
import { OptionsMatrixTable } from '../../components/view/stats/matrix-table';
import { OptionsSubjectBreakdownTable } from '../../components/view/stats/subject-breakdown';

export default function StudentOptionsStatsPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation(['subjectOptions']);

  const { data: optionsSetup } = useOptionsSetup(optionId);
  const { data: preferences } = useOptionsPreferences({ optionId });

  const subjectSetsGroupedByPool = useMemo(
    () => groupBy(optionsSetup?.subjectSets ?? [], 'poolIdx'),
    [optionsSetup]
  );

  return (
    <Stack direction="row" spacing={4} useFlexGap>
      <Stack spacing={2} sx={{ flex: 1 }} useFlexGap>
        {Object.entries(subjectSetsGroupedByPool).map(
          ([poolIdx, subjectSets], _i, entriesArray) => (
            <Stack spacing={1} useFlexGap>
              <Typography variant="subtitle1">
                {entriesArray.length > 1
                  ? t('subjectOptions:subjectCombinationStatsForPoolX', {
                      x: poolIdx,
                    })
                  : t('subjectOptions:subjectCombinationStats')}
              </Typography>
              <OptionsMatrixTable
                subjectSets={subjectSets ?? []}
                studentChoices={preferences ?? []}
              />
            </Stack>
          )
        )}
      </Stack>
      <Stack spacing={2} sx={{ flex: 1 }} useFlexGap>
        {optionsSetup?.subjectSets.map((subjectSet) => (
          <Stack spacing={1} useFlexGap>
            <Typography variant="subtitle1">
              {optionsSetup?.subjectSets.length > 1
                ? t('subjectOptions:subjectDemandStatsForSubjectSet', {
                    subjectSetName: subjectSet.name,
                  })
                : t('subjectOptions:subjectDemandStats')}
            </Typography>
            <OptionsSubjectBreakdownTable
              subjectSet={subjectSet}
              studentChoices={preferences ?? []}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
