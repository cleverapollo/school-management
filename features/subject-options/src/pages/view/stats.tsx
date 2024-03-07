import { useMemo } from 'react';
import { getNumber, useBreakpointValue } from '@tyro/core';
import groupBy from 'lodash/groupBy';
import { useParams } from 'react-router-dom';
import { Typography, Stack, Card } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useOptionsSetup } from '../../api/options';
import { useOptionsPreferences } from '../../api/options-preferences';
import { OptionsMatrixTable } from '../../components/view/stats/matrix-table';
import { OptionsSubjectBreakdownTable } from '../../components/view/stats/subject-breakdown';

export default function StudentOptionsStatsPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const direction = useBreakpointValue<'column' | 'row'>({
    base: 'column',
    md: 'row',
  });
  const { t } = useTranslation(['subjectOptions']);

  const { data: optionsSetup } = useOptionsSetup(optionId);
  const { data: preferences } = useOptionsPreferences({ optionId });

  const subjectSetsGroupedByPool = useMemo(
    () => groupBy(optionsSetup?.subjectSets ?? [], 'poolIdx'),
    [optionsSetup]
  );

  return (
    <Stack direction={direction} spacing={4} useFlexGap>
      <Stack spacing={2} sx={{ flex: 1 }} useFlexGap>
        {Object.entries(subjectSetsGroupedByPool).map(
          ([poolIdx, subjectSets], _i, entriesArray) => (
            <Card key={poolIdx} variant="soft">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pl={1}
                mb={1}
              >
                <Typography variant="h6" component="span">
                  {entriesArray.length > 1
                    ? t('subjectOptions:subjectCombinationStatsForPoolX', {
                        x: poolIdx,
                      })
                    : t('subjectOptions:subjectCombinationStats')}
                </Typography>
              </Stack>
              <OptionsMatrixTable
                subjectSets={subjectSets ?? []}
                studentChoices={preferences ?? []}
              />
            </Card>
          )
        )}
      </Stack>
      <Stack spacing={2} sx={{ flex: 1 }} useFlexGap>
        {optionsSetup?.subjectSets.map((subjectSet) => (
          <Card key={subjectSet.id.idx} variant="soft">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              pl={1}
              mb={1}
            >
              <Typography variant="h6" component="span">
                {optionsSetup?.subjectSets.length > 1
                  ? t('subjectOptions:subjectDemandStatsForSubjectSet', {
                      subjectSetName: subjectSet.name,
                    })
                  : t('subjectOptions:subjectDemandStats')}
              </Typography>
            </Stack>
            <OptionsSubjectBreakdownTable
              subjectSet={subjectSet}
              studentChoices={preferences ?? []}
            />
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
