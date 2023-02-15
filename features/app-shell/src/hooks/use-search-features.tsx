import Fuse from 'fuse.js';
import { useMemo } from 'react';
import {
  NavigationConfig,
  NavigationMenuLink,
  NavigationRootGroup,
  useNavigationConfig,
} from './use-navigation-config';

export interface FeaturePageForSearch {
  title: string;
  path: string;
  icon: JSX.Element;
  breadcrumbs: string[];
}

function getFeaturePagesFromGroupForSearch(
  group: NavigationRootGroup | NavigationMenuLink,
  breadcrumbs: string[],
  parentIcon?: JSX.Element
): FeaturePageForSearch[] {
  const icon = parentIcon ?? group.icon;
  const extendedBreadcrumbs = [...breadcrumbs, group.title];
  const groupsChildren = group?.children as NavigationMenuLink[] | undefined;

  if (Array.isArray(groupsChildren) && groupsChildren.length > 0) {
    return groupsChildren.reduce<FeaturePageForSearch[]>(
      (acc, child) => [
        ...acc,
        ...getFeaturePagesFromGroupForSearch(child, extendedBreadcrumbs, icon),
      ],
      []
    );
  }

  if (group.path && icon) {
    return [
      {
        title: group.title,
        path: group.path,
        icon,
        breadcrumbs: extendedBreadcrumbs,
      },
    ] as FeaturePageForSearch[];
  }

  return [];
}

function getFeaturePagesForSearch(
  navConfig: NavigationConfig
): FeaturePageForSearch[] {
  return navConfig.reduce<FeaturePageForSearch[]>((acc, category) => {
    if (Array.isArray(category.children)) {
      category.children.forEach((group) => {
        acc.push(
          ...getFeaturePagesFromGroupForSearch(group, [category.subheader])
        );
      });
    }

    return acc;
  }, []);
}

export function useSearchFeatures(searchQuery: string | undefined) {
  const navConfig = useNavigationConfig();

  const { searchInstance, options } = useMemo(() => {
    const searchFeatures = getFeaturePagesForSearch(navConfig);

    return {
      searchInstance: new Fuse(searchFeatures, {
        keys: [
          'title',
          {
            name: 'breadcrumbs',
            weight: 0.5,
          },
        ],
        threshold: 0.3,
      }),
      options: searchFeatures,
    };
  }, [navConfig]);

  return {
    results: !searchQuery ? [] : searchInstance.search(searchQuery),
    options,
  };
}
