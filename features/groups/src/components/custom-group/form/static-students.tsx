import { Grid } from '@mui/material';

import {
  Control,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';

import { useCallback } from 'react';
import { ListPeoplePagination } from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import { RHFAutocomplete } from '@tyro/core';
import { CustomGroupFormState } from './types';
import {
  StudentsSearchParty,
  useStudentsSearchProps,
} from '../../../hooks/use-students-search-props';

type StaticStudentsProps = {
  control: Control<CustomGroupFormState>;
  setFocus: UseFormSetFocus<CustomGroupFormState>;
  setValue: UseFormSetValue<CustomGroupFormState>;
};

export const StaticStudents = ({
  setValue,
  setFocus,
  control,
}: StaticStudentsProps) => {
  const { t } = useTranslation(['groups', 'common']);

  const students = useWatch({ control, name: 'staticStudents' });

  const studentsGroups = useStudentsSearchProps({
    unshiftMode: true,
    renderAvatarTags: () => null,
  });

  const removeStudent = useCallback(
    (currentPartyId: number) => {
      setValue(
        'staticStudents',
        students.filter(({ partyId }) => currentPartyId !== partyId)
      );
    },
    [setValue, students]
  );

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <RHFAutocomplete<CustomGroupFormState, StudentsSearchParty, true>
          {...studentsGroups}
          controlProps={{
            name: 'staticStudents',
            control,
          }}
        />
      </Grid>
      <ListPeoplePagination
        people={students}
        emptyTitle={t('groups:noStaticStudents')}
        emptyDescription={t('groups:noStaticStudentsCta')}
        noFoundMessage={t('groups:noStudentsFound')}
        removeLabel={t('groups:removeStudent')}
        onFocus={() => setFocus('staticStudents')}
        onRemove={removeStudent}
      />
    </Grid>
  );
};
