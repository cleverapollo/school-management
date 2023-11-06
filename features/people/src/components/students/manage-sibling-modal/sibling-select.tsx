import { Box, Typography } from '@mui/material';
import { RHFAutocomplete, usePreferredNameLayout } from '@tyro/core';
import { Control, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useCallback, useMemo } from 'react';
import { useStudentsForSiblingSearch } from '../../../api/student/students-for-sibling-search';
import { ManageSiblingFormValues } from './types';
import { SiblingListContainer, SiblingListItem } from './sibling-list';
import { usePeopleAutocompleteProps } from '../../common/use-people-autocomplete-props';

interface SiblingSelectProps {
  enrolledSiblings: ManageSiblingFormValues['enrolledSiblings'];
  nonEnrolledSiblings: ManageSiblingFormValues['nonEnrolledSiblings'];
  setValue: UseFormSetValue<ManageSiblingFormValues>;
  control: Control<ManageSiblingFormValues>;
}

type SibilingOption = Omit<
  NonNullable<ReturnType<typeof useStudentsForSiblingSearch>['data']>[number],
  '__typename'
>;

export function SiblingSelect({
  enrolledSiblings,
  nonEnrolledSiblings,
  setValue,
  control,
}: SiblingSelectProps) {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();
  const { data: students, isLoading } = useStudentsForSiblingSearch();
  const hasEnrolledSiblings = enrolledSiblings?.length > 0;
  const hasNonEnrolledSiblings = nonEnrolledSiblings?.length > 0;

  const peopleAutocompleteProps = usePeopleAutocompleteProps<SibilingOption>();

  const removeEnrolledSibling = useCallback(
    (partyId: number) => {
      const newEnrolledSiblings = enrolledSiblings.filter(
        (sibling) => sibling.partyId !== partyId
      );
      setValue('enrolledSiblings', newEnrolledSiblings);
    },
    [enrolledSiblings, setValue]
  );

  const removeNonEnrolledSibling = useCallback(
    (partyId: number) => {
      const newNonEnrolledSiblings = nonEnrolledSiblings.filter(
        (sibling) => sibling.partyId !== partyId
      );
      setValue('nonEnrolledSiblings', newNonEnrolledSiblings);
    },
    [nonEnrolledSiblings, setValue]
  );

  const sibilingOptions = useMemo(
    () =>
      students?.map((student) => ({
        ...student,
        // These are for the autocomplete
        ...student.person,
        caption: student.classGroup?.name,
      })) ?? [],
    [students]
  );

  return (
    <Box sx={{ px: 3, pt: 1 }}>
      <RHFAutocomplete<ManageSiblingFormValues, SibilingOption>
        {...peopleAutocompleteProps}
        label={t('people:searchForNewSibling')}
        multiple
        openOnFocus
        filterSelectedOptions
        disableClearable
        loading={isLoading}
        options={sibilingOptions}
        renderAvatarTags={() => null}
        controlProps={{
          control,
          name: 'enrolledSiblings',
        }}
      />
      {hasEnrolledSiblings && (
        <>
          <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
            {hasNonEnrolledSiblings
              ? t('people:enrolledSiblings')
              : t('common:siblings')}
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
            {hasEnrolledSiblings
              ? t('people:nonEnrolledSiblings')
              : t('common:siblings')}
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
