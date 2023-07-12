import { FieldValues } from 'react-hook-form';
import {
  RHFAutocomplete,
  RHFAutocompleteProps,
  usePreferredNameLayout,
} from '@tyro/core';
import { UseQueryReturnType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useStaffForSelect } from '../../api/staff';

type StaffSelectOption = UseQueryReturnType<typeof useStaffForSelect>[number];

type StaffPostsAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, StaffSelectOption>,
  'options'
>;

export const StaffAutocomplete = <TField extends FieldValues>(
  props: StaffPostsAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['common']);
  const { data: teacherData, isLoading } = useStaffForSelect({});
  const { displayName } = usePreferredNameLayout();

  return (
    <RHFAutocomplete<TField, StaffSelectOption>
      label={t('common:staffMember')}
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
      fullWidth
      loading={isLoading}
      options={teacherData ?? []}
      {...props}
    />
  );
};
