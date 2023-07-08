import { Box, Typography } from '@mui/material';
import { Autocomplete, usePreferredNameLayout } from '@tyro/core';
import { UseFormSetValue } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useStudentsForSiblingSearch } from '../../../api/student/students-for-sibling-search';
import { ManageSiblingFormValues } from './types';
import { SiblingListContainer, SiblingListItem } from './sibling-list';

interface SiblingSelectProps {
  enrolledSiblings: ManageSiblingFormValues['enrolledSiblings'];
  nonEnrolledSiblings: ManageSiblingFormValues['nonEnrolledSiblings'];
  setValue: UseFormSetValue<ManageSiblingFormValues>;
}

export function SiblingSelect({
  enrolledSiblings,
  nonEnrolledSiblings,
  setValue,
}: SiblingSelectProps) {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();
  const { data: students, isLoading } = useStudentsForSiblingSearch();
  const hasEnrolledSiblings = enrolledSiblings?.length > 0;
  const hasNonEnrolledSiblings = nonEnrolledSiblings?.length > 0;

  const removeEnrolledSibling = (partyId: number) => {
    const newEnrolledSiblings = enrolledSiblings.filter(
      (sibling) => sibling.partyId !== partyId
    );
    setValue('enrolledSiblings', newEnrolledSiblings);
  };
  const removeNonEnrolledSibling = (partyId: number) => {
    const newNonEnrolledSiblings = nonEnrolledSiblings.filter(
      (sibling) => sibling.partyId !== partyId
    );
    setValue('nonEnrolledSiblings', newNonEnrolledSiblings);
  };

  return (
    <Box sx={{ px: 3, pt: 1 }}>
      <Autocomplete
        label="Search for a sibling"
        loading={isLoading}
        options={students ?? []}
        value={null}
        clearOnBlur
        blurOnSelect
        isOptionEqualToValue={() => false}
        onChange={(_event, value) => {
          const newValue = Array.isArray(value) ? value[0] : value;
          if (
            newValue &&
            !enrolledSiblings.find(
              ({ partyId }) => partyId === newValue.partyId
            )
          ) {
            setValue('enrolledSiblings', [newValue, ...enrolledSiblings]);
          }
        }}
        getOptionLabel={(option) => displayName(option.person)}
        renderAvatarOption={(option, renderOption) =>
          renderOption({
            name: displayName(option.person),
            src: option.person.avatarUrl ?? undefined,
            caption: option.classGroup?.name ?? '',
          })
        }
      />
      {hasEnrolledSiblings && (
        <>
          <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
            {!hasNonEnrolledSiblings
              ? t('common:siblings')
              : t('people:enrolledSiblings')}
          </Typography>
          <SiblingListContainer>
            {enrolledSiblings.map((sibling) => (
              <SiblingListItem
                key={sibling.partyId}
                person={sibling.person}
                onRemove={removeEnrolledSibling}
              >
                <Typography
                  component="h4"
                  variant="subtitle2"
                  color="text.primary"
                >
                  {displayName(sibling.person)}
                </Typography>
                {sibling.classGroup?.name && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {sibling.classGroup?.name}
                  </Typography>
                )}
              </SiblingListItem>
            ))}
          </SiblingListContainer>
        </>
      )}
      {hasNonEnrolledSiblings && (
        <>
          <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
            {!hasEnrolledSiblings
              ? t('common:siblings')
              : t('people:nonEnrolledSiblings')}
          </Typography>
          <SiblingListContainer>
            {nonEnrolledSiblings.map((sibling) => {
              const person = {
                partyId: sibling.partyId,
                firstName: sibling.firstName,
                lastName: sibling.lastName,
              };
              return (
                <SiblingListItem
                  key={sibling.partyId}
                  person={person}
                  onRemove={removeNonEnrolledSibling}
                >
                  <Typography
                    component="h4"
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {displayName(person)}
                  </Typography>
                </SiblingListItem>
              );
            })}
          </SiblingListContainer>
        </>
      )}
    </Box>
  );
}
