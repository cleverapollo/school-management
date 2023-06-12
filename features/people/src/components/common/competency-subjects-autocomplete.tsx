import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from '@tyro/core';
import { CatalogueSubjectOption, useCatalogueSubjects } from '@tyro/settings';
import { Chip } from '@mui/material';
import { getColorBasedOnIndex } from '@tyro/api';

type CompetencySubjectsAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, CatalogueSubjectOption>,
  'options'
>;

export const CompetencySubjectsAutocomplete = <TField extends FieldValues>(
  props: CompetencySubjectsAutocompleteProps<TField>
) => {
  const { data: subjectsData = [] } = useCatalogueSubjects();

  return (
    <RHFAutocomplete<TField, CatalogueSubjectOption>
      optionIdKey="id"
      optionTextKey="name"
      fullWidth
      multiple
      options={subjectsData}
      renderTags={(tags, getTagProps) =>
        tags.map((tag, index) => (
          <Chip
            {...getTagProps({ index })}
            size="small"
            variant="soft"
            color={tag.colour || getColorBasedOnIndex(index)}
            label={tag.name}
          />
        ))
      }
      {...props}
    />
  );
};
