import { Grid } from '@mui/material';

import {
  Control,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';

import { useCallback } from 'react';
import { ListPeoplePagination, RHFStudentAutocomplete } from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import { CustomGroupFormState } from './types';

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
        <RHFStudentAutocomplete
          multiple
          unshiftMode
          filterSelectedOptions
          label={t('common:searchByMemberType.STUDENT')}
          renderAvatarTags={() => null}
          controlProps={{
            control,
            name: 'staticStudents',
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
