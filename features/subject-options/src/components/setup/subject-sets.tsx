import {
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Stack,
} from '@mui/material';
import { RHFSubjectAutocomplete } from '@tyro/settings';
import { useTranslation } from '@tyro/i18n';
import { Control, useFieldArray } from 'react-hook-form';
import { RHFTextField } from '@tyro/core';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { SubjectOptionsFormState } from './types';

interface SubjectSetsProps {
  poolIndex: number;
  control: Control<SubjectOptionsFormState>;
}

export const defaultSubjectSetProps = {
  name: '',
  canChoose: null,
  mustGet: null,
  subjects: [],
};

export function SubjectSets({ poolIndex, control }: SubjectSetsProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const {
    fields: subjectSets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `pools.${poolIndex}.subjectSets`,
  });

  return (
    <Stack
      sx={{
        px: 3,
        pb: 3,
        pt: 1,
      }}
      gap={2}
    >
      {subjectSets.map((subjectSet, index) => (
        <Card variant="outlined" key={subjectSet.id}>
          <CardHeader
            component="h5"
            title={t('subjectOptions:subjectSetN', { number: index + 1 })}
            titleTypographyProps={{
              variant: 'subtitle1',
            }}
            sx={{
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
          <Grid container spacing={2} p={3} pt={1} maxWidth={900}>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                label={t('common:name')}
                controlProps={{
                  name: `pools.${poolIndex}.subjectSets.${index}.name`,
                  control,
                }}
                textFieldProps={{
                  fullWidth: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFSubjectAutocomplete
                label={t('common:subjects')}
                multiple
                controlProps={{
                  name: `pools.${poolIndex}.subjectSets.${index}.subjects`,
                  control,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                label={t('subjectOptions:canChooseLabel')}
                controlProps={{
                  name: `pools.${poolIndex}.subjectSets.${index}.canChoose`,
                  control,
                }}
                textFieldProps={{
                  fullWidth: true,
                  placeholder: '0',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                label={t('subjectOptions:mustGetLabel')}
                controlProps={{
                  name: `pools.${poolIndex}.subjectSets.${index}.mustGet`,
                  control,
                }}
                textFieldProps={{
                  fullWidth: true,
                  placeholder: '0',
                }}
              />
            </Grid>
          </Grid>
        </Card>
      ))}
      <Stack width="fit-content">
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={() =>
            append({
              ...defaultSubjectSetProps,
              idx: subjectSets.length,
            })
          }
          startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
        >
          {t('subjectOptions:addSubjectSet')}
        </Button>
      </Stack>
    </Stack>
  );
}
