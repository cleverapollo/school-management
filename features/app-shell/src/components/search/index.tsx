import { useState, memo, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
// utils
import { SearchIcon } from '@tyro/icons';
import { useLocation } from 'react-router-dom';
import { useDebouncedValue } from '@tyro/core';
import { PagesSection } from './sections/pages-section';
import { SearchProvider } from './provider';
import { SearchInput } from './input';
import { useOmniSearch } from '../../api/search';
import { PeopleSection } from './sections/people-section';

function Searchbar() {
  const [open, setOpen] = useState(false);
  const {
    value: searchQuery,
    debouncedValue: debouncedSearchQuery,
    setValue: setSearchQuery,
  } = useDebouncedValue<string>({ defaultValue: '' });
  const location = useLocation();

  const { data, isLoading } = useOmniSearch(debouncedSearchQuery);
  const { hasResults, pages, people } = data || { hasResults: false };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((currentOpenValue) => !currentOpenValue);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open === true) {
      setOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (open === true) {
      setSearchQuery('');
    }
  }, [open]);

  console.log({
    searchQuery,
    pages,
    people,
  });

  return (
    <SearchProvider data={data}>
      <Box>
        <IconButton onClick={() => setOpen(true)}>
          <SearchIcon />
        </IconButton>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
          sx={{
            '& .MuiDialog-container': {
              alignItems: { xs: 'center', sm: 'flex-start' },
            },
          }}
          PaperProps={{
            sx: {
              mx: { xs: 0, sm: 2 },
              my: { xs: 0, sm: 8 },
            },
          }}
        >
          <DialogTitle component="div" sx={{ p: 0 }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </DialogTitle>
          {searchQuery && !isLoading && (
            <>
              <Divider />
              <DialogContent dividers sx={{ px: 2 }}>
                {hasResults ? (
                  <Box
                    component="ul"
                    role="listbox"
                    sx={{
                      p: 0,
                      my: 0,
                      '&, & ul': {
                        listStyle: 'none',
                        px: 0,
                      },
                    }}
                  >
                    <PeopleSection people={people} />
                    <PagesSection pages={pages} />
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    No results found
                  </Typography>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </SearchProvider>
  );
}

export default memo(Searchbar);
