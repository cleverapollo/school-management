import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Tooltip,
  Typography,
  Box,
  Link,
  Stack,
  ListItemIcon,
  Checkbox,
} from '@mui/material';

import {
  Avatar,
  PlaceholderCard,
  SearchInput,
  usePaginationList,
  usePreferredNameLayout,
} from '@tyro/core';
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { TrashIcon } from '@tyro/icons';
import { Person } from '@tyro/api';

type PersonPagination = Omit<Person, '__typename'> & { caption?: string };

type ListPeoplePaginationProps<T extends PersonPagination> = {
  people: T[];
  emptyTitle: string;
  emptyDescription: string;
  noFoundMessage: string;
  removeLabel: string;
  rightAdornment?: ReactNode;
  renderAction?: (person: T) => ReactNode;
  onFocus: () => void;
  onRowSelection?: (person: T[]) => void;
  onRemove: (partyId: T['partyId']) => void;
};

export const ListPeoplePagination = <T extends PersonPagination>({
  people,
  emptyTitle,
  emptyDescription,
  noFoundMessage,
  removeLabel,
  rightAdornment,
  renderAction,
  onRowSelection,
  onFocus,
  onRemove,
}: ListPeoplePaginationProps<T>) => {
  const { displayName, searchDisplayName } = usePreferredNameLayout();
  const [searchPeople, setSearchPeople] = useState('');

  const selectedPeopleRef = useRef<Record<number, T>>({} as Record<number, T>);

  const filteredPeople = useMemo(
    () => searchDisplayName(people, searchPeople),
    [people, searchPeople]
  );

  const { currentList, paginationCount, currentPage, setCurrentPage } =
    usePaginationList<T[]>({
      initialList: people,
      filteredList: filteredPeople,
    });

  const handleRowSelection = useCallback((checked: boolean, person: T) => {
    if (checked) {
      selectedPeopleRef.current[person.partyId] = person;
    } else {
      delete selectedPeopleRef.current[person.partyId];
    }

    onRowSelection?.(Object.values(selectedPeopleRef.current));
  }, []);

  return (
    <Grid container gap={2}>
      {people.length > 0 && (
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <SearchInput
              value={searchPeople}
              onChange={(e) => setSearchPeople(e.target.value)}
              size="small"
              containerProps={{ width: rightAdornment ? '50%' : '100%' }}
            />
            {rightAdornment}
          </Stack>
        </Grid>
      )}
      <Grid item xs={12}>
        {people.length === 0 && (
          <PlaceholderCard cardProps={{ sx: { boxShadow: 'none', p: 0 } }}>
            <Box>
              <Typography component="h4" variant="subtitle1">
                {emptyTitle}
              </Typography>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onFocus}
              >
                {emptyDescription}
              </Link>
            </Box>
          </PlaceholderCard>
        )}
        {filteredPeople.length === 0 && searchPeople.length > 0 && (
          <PlaceholderCard
            cardProps={{
              sx: { boxShadow: 'none', p: 0 },
            }}
          >
            <Stack direction="column">
              <Typography component="h4" variant="body1" color="primary">
                {noFoundMessage}
              </Typography>
              <img
                alt=""
                src="/assets/illustrations/illustration-user-cloud.svg"
              />
            </Stack>
          </PlaceholderCard>
        )}
        {filteredPeople.length > 0 && (
          <List sx={{ width: '100%' }}>
            {currentList.map((person) => (
              <ListItem
                key={person.partyId}
                secondaryAction={
                  <Tooltip title={removeLabel}>
                    <IconButton
                      color="primary"
                      onClick={() => onRemove(person.partyId)}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                {onRowSelection && (
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      checked={!!selectedPeopleRef.current[person.partyId]}
                      disableRipple
                      onChange={(_event, checked) => {
                        handleRowSelection(checked, person);
                      }}
                    />
                  </ListItemIcon>
                )}
                <ListItemAvatar>
                  <Avatar src={person.avatarUrl} name={displayName(person)} />
                </ListItemAvatar>
                <ListItemText
                  primary={displayName(person)}
                  secondary={person.caption}
                />
                {renderAction?.(person)}
              </ListItem>
            ))}
          </List>
        )}
      </Grid>
      {paginationCount > 1 && (
        <Grid item xs={12}>
          <Pagination
            page={currentPage}
            onChange={(_e, p) => setCurrentPage(p)}
            count={paginationCount}
          />
        </Grid>
      )}
    </Grid>
  );
};
