import { Grid } from '@mui/material';

import {
  Control,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';

import { useCallback } from 'react';
import { ListPeoplePagination, RHFStaffAutocomplete } from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import { CustomGroupFormState } from './types';

type StaticStaffProps = {
  control: Control<CustomGroupFormState>;
  setFocus: UseFormSetFocus<CustomGroupFormState>;
  setValue: UseFormSetValue<CustomGroupFormState>;
};

export const StaticStaff = ({
  setValue,
  setFocus,
  control,
}: StaticStaffProps) => {
  const { t } = useTranslation(['groups', 'common']);

  const staff = useWatch({ control, name: 'staticStaff' });

  const removeStaff = useCallback(
    (currentPartyId: number) => {
      setValue(
        'staticStaff',
        staff.filter(({ partyId }) => currentPartyId !== partyId)
      );
    },
    [setValue, staff]
  );

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <RHFStaffAutocomplete
          multiple
          unshiftMode
          filterSelectedOptions
          label={t('common:searchByMemberType.STAFF')}
          renderAvatarTags={() => null}
          controlProps={{
            control,
            name: 'staticStaff',
          }}
        />
      </Grid>
      <ListPeoplePagination
        people={staff}
        emptyTitle={t('groups:noStaticStaff')}
        emptyDescription={t('groups:noStaticStaffCta')}
        noFoundMessage={t('groups:noStaffFound')}
        removeLabel={t('groups:removeStaff')}
        onFocus={() => setFocus('staticStaff')}
        onRemove={removeStaff}
      />
    </Grid>
  );
};
