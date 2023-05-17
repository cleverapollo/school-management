import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import {
  StudentContactRelationshipInfoInput,
  StudentContactType,
} from '@tyro/api';
import {
  Avatar,
  RHFAutocomplete,
  RHFSelect,
  RHFSwitch,
  usePreferredNameLayout,
} from '@tyro/core';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { Fragment, useMemo } from 'react';
import {
  StudentSelectOption,
  useStudentsForSelect,
} from '../../../api/students';

const relationshipTypeOptions = Object.values(StudentContactType);
const priorityOptions = Array.from({ length: 5 }, (_v, k) => k + 1);

export type StudentRelationship = StudentContactRelationshipInfoInput & {
  student: StudentSelectOption;
};

export type StudentRelationshipsFormState = {
  studentRelationships: StudentRelationship[];
};

type StudentRelationshipsProps<TField extends StudentRelationshipsFormState> = {
  control: TField extends StudentRelationshipsFormState
    ? Control<TField>
    : never;
};

export const StudentRelationships = <
  TField extends StudentRelationshipsFormState
>({
  control,
}: StudentRelationshipsProps<TField>) => {
  const { t } = useTranslation(['common', 'people']);
  const { spacing } = useTheme();

  const { data: studentsData = [] } = useStudentsForSelect({});
  const { displayName } = usePreferredNameLayout();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'studentRelationships',
  });

  const { studentRelationships } = useWatch({ control });

  const availableStudents = useMemo(() => {
    const currentStudents = studentRelationships?.map(
      (selected) => selected.student?.partyId
    );

    return studentsData.filter(
      ({ partyId }) => !currentStudents?.includes(partyId)
    );
  }, [studentsData, studentRelationships]);

  return (
    <Stack direction="column" gap={2.5}>
      <Typography
        variant="body1"
        component="h3"
        color="text.secondary"
        fontWeight={600}
      >
        {t('people:studentRelationships')}
      </Typography>

      <Table
        size="small"
        sx={{
          '& td:first-of-type': {
            width: '35%',
            paddingLeft: 0,
          },
          '& td:last-of-type': {
            width: spacing(8),
            maxWidth: spacing(8),
          },
        }}
      >
        <TableBody>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <TableRow>
                <TableCell>
                  <RHFAutocomplete<
                    StudentRelationshipsFormState,
                    StudentSelectOption,
                    true
                  >
                    fullWidth
                    freeSolo
                    label={t('people:studentName')}
                    options={availableStudents}
                    optionIdKey="partyId"
                    getOptionLabel={(option) =>
                      typeof option === 'string' ? option : displayName(option)
                    }
                    renderAvatarAdornment={(value, renderAdornment) =>
                      renderAdornment({
                        name: displayName(value),
                        src: value.avatarUrl,
                      })
                    }
                    renderAvatarOption={(option, renderOption) =>
                      renderOption({
                        name: displayName(option),
                        src: option.avatarUrl,
                      })
                    }
                    controlProps={{
                      name: `studentRelationships.${index}.student`,
                      control,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <RHFSelect<StudentRelationshipsFormState, StudentContactType>
                    fullWidth
                    label={t('people:relationToStudent')}
                    options={relationshipTypeOptions}
                    getOptionLabel={(option) =>
                      t(`common:relationshipType.${option}`)
                    }
                    controlProps={{
                      name: `studentRelationships.${index}.relationshipType`,
                      control,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <RHFSelect
                    label={t('people:priority')}
                    sx={{ width: spacing(25) }}
                    options={priorityOptions}
                    getOptionLabel={(option) => String(option)}
                    controlProps={{
                      name: `studentRelationships.${index}.priority`,
                      control,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {index > 0 && (
                    <IconButton
                      color="primary"
                      aria-label={t('common:delete')}
                      onClick={() => remove(index)}
                    >
                      <TrashIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
              <TableRow sx={{ verticalAlign: 'top' }}>
                <TableCell sx={{ pb: 3 }}>
                  <RHFSwitch
                    label={t('people:allowedToContact')}
                    switchProps={{ color: 'primary' }}
                    controlProps={{
                      name: `studentRelationships.${index}.allowedToContact`,
                      control,
                    }}
                  />
                  <RHFSwitch
                    label={t('people:legalGuardian')}
                    switchProps={{ color: 'primary' }}
                    controlProps={{
                      name: `studentRelationships.${index}.legalGuardian`,
                      control,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <RHFSwitch
                    label={t('people:pickupPermission')}
                    switchProps={{ color: 'primary' }}
                    controlProps={{
                      name: `studentRelationships.${index}.pickupRights`,
                      control,
                    }}
                  />
                  <RHFSwitch
                    label={t('people:allowAccessToStudentData')}
                    switchProps={{ color: 'primary' }}
                    controlProps={{
                      name: `studentRelationships.${index}.allowAccessToStudentData`,
                      control,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <RHFSwitch
                    label={t('people:includeInSms')}
                    switchProps={{ color: 'primary' }}
                    controlProps={{
                      name: `studentRelationships.${index}.includeInSms`,
                      control,
                    }}
                  />
                  <RHFSwitch
                    label={t('people:includeInTmail')}
                    switchProps={{ color: 'primary' }}
                    controlProps={{
                      name: `studentRelationships.${index}.includeInTmail`,
                      control,
                    }}
                  />
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>

      <Stack width="fit-content">
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={() => append({} as StudentRelationship)}
          startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
        >
          {t('people:addStudent')}
        </Button>
      </Stack>
    </Stack>
  );
};
