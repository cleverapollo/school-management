import { useState, PropsWithChildren } from 'react';
import { useMatches, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Stack } from '@mui/material';

import { LazyLoader } from '../lazy-loader';

import { LinkTab, Tabs } from '../tabs';

type TabLink = { label: string; value: string };

type TabNavigationProps = PropsWithChildren<{
  links: TabLink[];
}>;

function getInitialTabValue(
  matches: ReturnType<typeof useMatches>,
  tabs: TabLink[]
) {
  const lastUrl = matches[matches.length - 1].pathname;
  const matchedPathname = tabs.find(({ value }) => lastUrl.endsWith(value));

  return matchedPathname?.value ?? tabs[0].value;
}

export const TabPageContainer = ({ links }: TabNavigationProps) => {
  const matches = useMatches();

  const [value, setValue] = useState<string>(() =>
    getInitialTabValue(matches, links)
  );

  return (
    <Stack flexDirection="column" gap={3}>
      <Tabs
        value={value}
        onChange={(_event, newValue: string) => {
          setValue(newValue);
        }}
      >
        {links.map((tab) => (
          <LinkTab key={tab.value} {...tab} to={`./${tab.value}`} />
        ))}
      </Tabs>
      <LazyLoader
        fallback={
          <Box
            sx={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Outlet />
      </LazyLoader>
    </Stack>
  );
};

if (process.env.NODE_ENV !== 'production') {
  TabPageContainer.displayName = 'TabPageContainer';
}
