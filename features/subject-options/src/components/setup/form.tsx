import { Card, CardHeader, Grid, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { RHFAutocomplete } from 'packages/core/src';
import { useForm } from 'react-hook-form';
import { AcademicYearSelect } from './academic-year-select';

interface FormState {
  academicYearId: number;
  classGroups: number[];
}

export function SubjectOptionsSetupForm() {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const { control, handleSubmit } = useForm<FormState>();

  const onSubmit = handleSubmit((data) => {
    console.log('submit', { data });
  });

  return (
    <Stack component="form" onSubmit={onSubmit} gap={3}>
      <Card variant="outlined">
        <CardHeader
          component="h2"
          title={t('subjectOptions:studentSelection')}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <AcademicYearSelect<FormState>
              controlProps={{
                name: 'academicYearId',
                control,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFAutocomplete<FormState, CommentBankOption>
              label={t('subjectOptions:classGroups')}
              // optionIdKey="id"
              // optionTextKey="name"
              controlProps={{ name: '', control }}
              // options={commentBankData}
            />
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
}
