import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Avatar,
  PlaceholderCard,
  SearchInput,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUsePeopleBasedOnPartyIds } from '@tyro/people';
import { PartyPersonType } from '@tyro/api';
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react';

interface SelectStudentsStepTwoFormProps {
  peopleFromSelectedGroups:
    | ReturnTypeFromUsePeopleBasedOnPartyIds[]
    | undefined;
  excludedStudents: Set<number>;
  setExcludedStudents: Dispatch<SetStateAction<Set<number>>>;
}

export function SelectStudentsStepTwoForm({
  peopleFromSelectedGroups,
  excludedStudents,
  setExcludedStudents,
}: SelectStudentsStepTwoFormProps) {
  const id = useId();
  const { t } = useTranslation(['attendance']);
  const { displayName, searchDisplayName } = usePreferredNameLayout();
  const [searchValue, setSearchValue] = useState('');

  const filteredStudents = useMemo(() => {
    const students =
      peopleFromSelectedGroups?.filter(
        (person) => person.type === PartyPersonType.Student
      ) ?? [];
    return searchDisplayName(students, searchValue);
  }, [searchValue, searchDisplayName, peopleFromSelectedGroups]);

  const toggleSelectedStudent = (partyId: number) => {
    setExcludedStudents((prevExcludedStudents) => {
      const newExcludedStudents = new Set(prevExcludedStudents);
      if (prevExcludedStudents.has(partyId)) {
        newExcludedStudents.delete(partyId);
      } else {
        newExcludedStudents.add(partyId);
      }
      return newExcludedStudents;
    });
  };

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t('attendance:deselectBulkAttendanceStudentsParagraph')}
      </Typography>
      <SearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <List>
        {filteredStudents.map((person) => {
          const labelId = `${id}-${person.partyId}`;
          const name = displayName(person);

          return (
            <ListItem
              key={labelId}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={() => toggleSelectedStudent(person.partyId)}
                  checked={!excludedStudents.has(person.partyId)}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              }
              disablePadding
              sx={{
                '& .MuiButtonBase-root': {
                  borderRadius: 1,
                },
              }}
            >
              <ListItemButton
                role={undefined}
                onClick={() => toggleSelectedStudent(person.partyId)}
              >
                <ListItemAvatar>
                  <Avatar name={name} src={person.avatarUrl ?? undefined} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {filteredStudents.length === 0 && (
        <PlaceholderCard cardProps={{ sx: { boxShadow: 'none', p: 0 } }}>
          <Box>
            <Typography component="h4" variant="subtitle1">
              {t('attendance:noStudentsFound')}
            </Typography>
          </Box>
        </PlaceholderCard>
      )}
    </Box>
  );
}
