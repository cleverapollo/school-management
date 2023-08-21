import { useState, PropsWithChildren, ComponentProps, useEffect } from 'react';
import { useMatches, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Stack } from '@mui/material';

import { PermissionUtils, usePermissions } from '@tyro/api';
import { LazyLoader } from '../lazy-loader';

import { LinkTab, Tabs } from '../tabs';

type TabLink = {
  label: string;
  value: string;
  hasAccess?: (permissions: PermissionUtils) => boolean;
};

type TabNavigationProps = PropsWithChildren<{
  links: TabLink[];
  TabProps?: Omit<ComponentProps<typeof Tabs>, 'value' | 'onChange'>;
}>;

function getInitialTabValue(
  matches: ReturnType<typeof useMatches>,
  tabs: TabLink[]
) {
  const lastUrl = matches[matches.length - 1].pathname;
  const matchedPathname = tabs.find(({ value }) => lastUrl.endsWith(value));

  return matchedPathname?.value ?? tabs[0].value;
}

export const TabPageContainer = ({ links, TabProps }: TabNavigationProps) => {
  const matches = useMatches();
  const permissions = usePermissions();
  const [value, setValue] = useState<string>(() =>
    getInitialTabValue(matches, links)
  );

  useEffect(() => {
    const matchedPath = getInitialTabValue(matches, links);
    if (value !== matchedPath) {
      setValue(matchedPath);
    }
  }, [matches]);

  return (
    <Stack flexDirection="column" gap={3} flex={1}>
      <Tabs value={value} {...TabProps}>
        {links
          .filter((tab) =>
            tab.hasAccess != null ? tab.hasAccess(permissions) : true
          )
          .map(({ label, value: tabValue }) => (
            <LinkTab
              key={tabValue}
              label={label}
              value={tabValue}
              to={`./${tabValue}`}
            />
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
