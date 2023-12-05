import {
  Card,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { RHFAutocomplete } from '@tyro/core';
import { SaveSubjectSet } from '@tyro/api';
import { useFieldArray, useForm } from 'react-hook-form';
import { TrashIcon } from '@tyro/icons';
import { AcademicYearSelect } from './academic-year-select';

interface FormState {
  academicYearId: number;
  classGroups: number[];
  subjectSets: SaveSubjectSet[];
}

export function SubjectOptionsSetupForm() {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const { control, handleSubmit } = useForm<FormState>({
    defaultValues: {
      subjectSets: [{}],
    },
  });
  const {
    fields: subjectPools,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'subjectSets',
  });

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
        <Stack direction="column" gap={3} p={3}>
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
              {/* <RHFAutocomplete<FormState, CommentBankOption>
                label={t('subjectOptions:classGroups')}
                // optionIdKey="id"
                // optionTextKey="name"
                controlProps={{ name: 'classGroups', control }}
                // options={commentBankData}
              /> */}
            </Grid>
          </Grid>
        </Stack>
      </Card>
      <Card variant="outlined">
        <CardHeader component="h2" title={t('subjectOptions:subjectSetup')} />
        <Stack direction="column" p={3}>
          <Typography
            variant="body1"
            component="h3"
            color="text.secondary"
            fontWeight={600}
          >
            {t('subjectOptions:atLeastOneSubjectPoolRequired')}
          </Typography>
          {subjectPools.map((pool, index) => (
            <Card variant="outlined">
              <CardHeader
                component="h4"
                title={t('subjectOptions:poolN', { number: index + 1 })}
                sx={{
                  pb: 0,
                  border: 0,
                }}
                action={
                  index === 0 ? null : (
                    <IconButton
                      color="primary"
                      aria-label={t('common:delete')}
                      onClick={() => remove(index)}
                    >
                      <TrashIcon />
                    </IconButton>
                  )
                }
              />
            </Card>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
