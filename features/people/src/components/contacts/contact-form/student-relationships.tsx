import {
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { StudentContactType } from '@tyro/api';
import { RHFAutocomplete, RHFSelect, usePreferredNameLayout } from '@tyro/core';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { AddIcon, TrashIcon } from '@tyro/icons';
import { useMemo } from 'react';
import {
  StudentSelectOption,
  useStudentsForSelect,
} from '../../../api/students';

const relationshipTypeOptions = Object.values(StudentContactType);

type StudentRelationship = {
  relationshipType: StudentContactType | null;
  student: StudentSelectOption | null;
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
        {t('people:contactForm.studentRelationships')}
      </Typography>
      <Table
        size="small"
        sx={{
          '& th': {
            background: 'transparent',
            color: 'text.secondary',
            fontWeight: 600,
          },
          '& td:first-of-type, & td:nth-of-type(3)': {
            width: '45%',
          },
          '& td:nth-of-type(2), & td:last-of-type': {
            width: '64px',
            maxWidth: '64px',
            textAlign: 'center',
          },
          '& tbody td': {
            verticalAlign: 'middle',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>{t('people:contactForm.labels.relationship')}</TableCell>
            <TableCell />
            <TableCell>{t('people:contactForm.labels.student')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <RHFSelect<StudentRelationshipsFormState, StudentContactType>
                  fullWidth
                  label={t('people:contactForm.labels.studentContactType')}
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
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {t('people:contactForm.labels.of')}
                </Typography>
              </TableCell>
              <TableCell>
                <RHFAutocomplete<
                  StudentRelationshipsFormState,
                  StudentSelectOption,
                  true
                >
                  fullWidth
                  freeSolo
                  label={t('people:contactForm.labels.studentName')}
                  options={availableStudents}
                  optionIdKey="partyId"
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : displayName(option)
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
          ))}
        </TableBody>
      </Table>
      <Stack width="fit-content">
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={() =>
            append({
              relationshipType: null,
              student: null,
            })
          }
          startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
        >
          {t('people:contactForm.addStudent')}
        </Button>
      </Stack>
    </Stack>
  );
};
