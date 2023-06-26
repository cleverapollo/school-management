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
import { useTranslation } from '@tyro/i18n';
import { PagesSection } from './sections/pages-section';
import { SearchProvider } from './provider';
import { SearchInput } from './input';
import { useOmniSearch } from '../../api/search';
import { PeopleSection } from './sections/people-section';
import { GroupsSection } from './sections/groups-section';
import { RecentSearchSection } from './sections/recent-search-section';
import { SearchListboxContainer } from './listbox-container';

function Searchbar() {
  const [open, setOpen] = useState(false);
  const {
    value: searchQuery,
    debouncedValue: debouncedSearchQuery,
    setValue: setSearchQuery,
  } = useDebouncedValue<string>({ defaultValue: '' });
  const location = useLocation();
  const { t } = useTranslation(['common']);

  const { data, isLoading } = useOmniSearch(debouncedSearchQuery);
  const { hasResults, pages, people, groups } = data || { hasResults: false };

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
          {/* Need to move logic to backend rather than localstorage */}
          {/* {(!searchQuery || isLoading) && <RecentSearchSection />} */}
          {searchQuery && !isLoading && (
            <>
              <Divider />
              <DialogContent dividers sx={{ px: 2 }}>
                {hasResults ? (
                  <SearchListboxContainer>
                    <PeopleSection people={people} />
                    <GroupsSection groups={groups} />
                    <PagesSection pages={pages} />
                  </SearchListboxContainer>
                ) : (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {t('common:noResultsFound')}
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
