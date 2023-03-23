import { useState, PropsWithChildren } from 'react';
import { useMatches } from 'react-router-dom';

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

export const TabNavigation = ({ links }: TabNavigationProps) => {
  const matches = useMatches();

  const [value, setValue] = useState<string>(() =>
    getInitialTabValue(matches, links)
  );

  return (
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
  );
};
