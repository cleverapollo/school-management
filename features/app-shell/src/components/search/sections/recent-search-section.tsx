import { IconButton, DialogContent, Divider } from '@mui/material';
import { CloseIcon } from '@tyro/icons';
import { SearchType } from '@tyro/api';
import { useMemo } from 'react';
import { useSearchFeatures } from '../../../hooks/use-search-features';
import { SearchListboxContainer } from '../listbox-container';
import { useSearchProvider } from '../provider';
import { SectionContainer } from '../section-container';
import { GroupOption } from './groups-section';
import { PageOption } from './pages-section';
import { PersonOption } from './people-section';

export function RecentSearchSection() {
  const { recentSearchs, removeRecentSearch } = useSearchProvider();
  const { options } = useSearchFeatures('');

  const convertedRecentOptions = useMemo(
    () =>
      recentSearchs.map((recentSearch) => {
        if (recentSearch.type === 'PAGE') {
          const matchingOption = options.find(
            (option) => option.path === recentSearch?.meta?.path
          );

          if (!matchingOption) return recentSearch;

          return {
            ...recentSearch,
            meta: {
              ...(recentSearch?.meta ?? {}),
              icon: matchingOption.icon,
            },
          };
        }

        return recentSearch;
      }),
    [recentSearchs, options]
  );

  if (convertedRecentOptions.length <= 0) return null;

  return (
    <>
      <Divider />
      <DialogContent dividers sx={{ px: 2 }}>
        <SearchListboxContainer>
          <SectionContainer heading="Recent">
            {convertedRecentOptions?.map((option) => {
              const endIcon = (
                <IconButton
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    removeRecentSearch(option.partyId);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              );

              if (option.type === 'PAGE') {
                return (
                  <PageOption
                    key={option.partyId}
                    option={option}
                    endIcon={endIcon}
                  />
                );
              }

              if (
                option.type === SearchType.Contact ||
                option.type === SearchType.Student ||
                option.type === SearchType.Staff
              ) {
                return (
                  <PersonOption
                    key={option.partyId}
                    option={option}
                    endIcon={endIcon}
                  />
                );
              }

              return (
                <GroupOption
                  key={option.partyId}
                  option={option}
                  endIcon={endIcon}
                />
              );
            })}
          </SectionContainer>
        </SearchListboxContainer>
      </DialogContent>
    </>
  );
}
