import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from '@tyro/core';
import { useStaffPosts, StaffPostsOption } from '../../api/staff/staff-posts';

type StaffPostsAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, StaffPostsOption>,
  'options'
>;

export const StaffPostsAutocomplete = <TField extends FieldValues>(
  props: StaffPostsAutocompleteProps<TField>
) => {
  const { data: postsData = [] } = useStaffPosts();

  return (
    <RHFAutocomplete<TField, StaffPostsOption>
      optionIdKey="id"
      optionTextKey="name"
      fullWidth
      options={postsData}
      {...props}
    />
  );
};
