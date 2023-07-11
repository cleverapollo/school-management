import { Box, Checkbox, Fade, Stack, Typography } from '@mui/material';
import { Avatar, Select, usePreferredNameLayout } from '@tyro/core';
import { StudentContactType } from '@tyro/api';
import { UseFormSetValue } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { ManageSiblingFormValues } from './types';
import { ReturnTypeFromUseStudentPersonal } from '../../../api/student/personal';

interface NewContactSelectProps {
  additionalContacts: ManageSiblingFormValues['enrolledSiblings'][number]['contacts'];
  setValue: UseFormSetValue<ManageSiblingFormValues>;
  newContacts: ManageSiblingFormValues['newContacts'];
  currentStudent: ReturnTypeFromUseStudentPersonal['person'];
}

export function NewContactSelect({
  additionalContacts,
  setValue,
  newContacts,
  currentStudent,
}: NewContactSelectProps) {
  const { displayName } = usePreferredNameLayout();
  const { t } = useTranslation(['common', 'people']);

  const newContactIds = Object.keys(newContacts);

  const options = Object.values(StudentContactType).map((option) => ({
    value: option,
    label: t(`common:relationshipType.${option}`),
  }));

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="body2">
        {t('people:foundAssociatedContact', {
          count: additionalContacts?.length ?? 0,
          studentName: displayName(currentStudent),
        })}
      </Typography>

      <Typography component="h3" variant="subtitle1" sx={{ mt: 3 }}>
        {t('people:selectContactsToAssociateWithStudent', {
          studentName: displayName(currentStudent),
        })}
      </Typography>
      <Stack
        component="ul"
        spacing={1}
        sx={{
          mx: 0,
          my: 1,
          px: 0,
          '& li': {
            bgcolor: 'background.neutral',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '300ms',
            transitionProperty: 'background-color, opacity',

            '&.selected': {
              bgcolor: 'primary.lighter',
            },
          },
        }}
      >
        {additionalContacts?.map(({ partyId, person }) => {
          const isSelected = newContactIds.includes(partyId.toString());

          return (
            <Stack
              key={partyId}
              className={isSelected ? 'selected' : ''}
              component="li"
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                p: 1,
                pr: 2,
                borderRadius: 1.5,
                justifyContent: 'space-between',
              }}
            >
              <Checkbox
                sx={{ p: 0, mr: 1 }}
                checked={isSelected}
                onChange={(_event, checked) => {
                  if (checked) {
                    setValue(`newContacts`, {
                      ...newContacts,
                      [partyId]: StudentContactType.Aunty,
                    });
                  } else {
                    delete newContacts[partyId];
                    setValue(`newContacts`, { ...newContacts });
                  }
                }}
              />
              <Avatar
                src={person?.avatarUrl}
                name={displayName(person)}
                sx={{
                  my: 1,
                  mr: 0.5,
                }}
              />
              <Stack alignItems="flex-start" flex="1">
                <Typography
                  component="h4"
                  variant="subtitle2"
                  color="text.primary"
                >
                  {displayName(person)}
                </Typography>
              </Stack>
              <Fade in={isSelected} timeout={{ enter: 300, exit: 0 }}>
                <Box>
                  <Select
                    options={options}
                    optionIdKey="value"
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={newContacts[partyId] ?? ''}
                    sx={{
                      backgroundColor: 'background.neutral',
                      borderRadius: 1,
                    }}
                    onChange={(event) => {
                      const newValue = event.target.value as StudentContactType;
                      setValue(`newContacts`, {
                        ...newContacts,
                        [partyId]: newValue,
                      });
                    }}
                  />
                </Box>
              </Fade>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
