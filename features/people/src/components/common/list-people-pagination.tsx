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
} from '@mui/material';

import {
  Avatar,
  PlaceholderCard,
  SearchInput,
  usePaginationList,
  usePreferredNameLayout,
} from '@tyro/core';
import { useMemo, useState } from 'react';
import { TrashIcon } from '@tyro/icons';
import { Person } from '@tyro/api';

type PersonPagination = Omit<Person, '__typename'> & { caption?: string };

type ListPeoplePaginationProps<T extends PersonPagination> = {
  people: T[];
  emptyTitle: string;
  emptyDescription: string;
  noFoundMessage: string;
  removeLabel: string;
  onFocus: () => void;
  onRemove: (partyId: T['partyId']) => void;
};

export const ListPeoplePagination = <T extends PersonPagination>({
  people,
  emptyTitle,
  emptyDescription,
  noFoundMessage,
  removeLabel,
  onFocus,
  onRemove,
}: ListPeoplePaginationProps<T>) => {
  const { displayName, searchDisplayName } = usePreferredNameLayout();

  const [searchPeople, setSearchPeople] = useState('');

  const filteredPeople = useMemo(
    () => searchDisplayName(people, searchPeople),
    [people, searchPeople]
  );

  const { currentList, paginationCount, currentPage, setCurrentPage } =
    usePaginationList<T[]>({
      initialList: people,
      filteredList: filteredPeople,
    });

  return (
    <Grid container gap={2}>
      {people.length > 1 && (
        <Grid item xs={12}>
          <SearchInput
            value={searchPeople}
            onChange={(e) => setSearchPeople(e.target.value)}
            size="medium"
          />
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
                <ListItemAvatar>
                  <Avatar src={person.avatarUrl} name={displayName(person)} />
                </ListItemAvatar>
                <ListItemText
                  primary={displayName(person)}
                  secondary={person.caption}
                />
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
