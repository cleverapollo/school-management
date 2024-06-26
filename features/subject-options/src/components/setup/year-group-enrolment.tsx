import { RHFSelect } from '@tyro/core';
import { useYearGroups } from '@tyro/api';
import { Control } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { SubjectOptionsFormState } from './types';

interface YearGroupEnrolmentProps {
  control: Control<SubjectOptionsFormState>;
}

export function YearGroupEnrolment({ control }: YearGroupEnrolmentProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const { data: options = [] } = useYearGroups({});

  return (
    <RHFSelect
      variant="white-filled"
      label={t('subjectOptions:whatYearAreStudentsGoingInto')}
      controlProps={{
        name: 'yearGroupId',
        control,
      }}
      optionIdKey="yearGroupId"
      optionTextKey="name"
      fullWidth
      sx={{
        maxWidth: 360,
        '& .MuiInputBase-root': {
          border: '1px solid',
          borderColor: 'indigo.50',
        },
      }}
      options={options}
    />
  );
}
