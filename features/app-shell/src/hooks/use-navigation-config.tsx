import { useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { usePermissions, UsePermissionsReturn } from '@tyro/api';
import {
  MenuLink,
  NonMenuLink,
  RootGroup,
  RootLink,
  NavObjectType,
} from '@tyro/core';
import { getNavCategories } from '../router';

export interface NavigationMenuLink {
  title: string;
  path?: string;
  icon?: never;
  info?: JSX.Element;
  children?: Omit<NavigationMenuLink, 'children'>[];
}

export interface NavigationRootGroup {
  title: string;
  path?: string;
  icon: JSX.Element;
  info?: JSX.Element;
  children?: NavigationMenuLink[];
}

export type NavigationConfig = Array<{
  subheader: string;
  children: NavigationRootGroup[];
}>;

// Create a function to join url paths together and remove any double slashes
// that may be created.
const joinPaths = (...paths: string[]) =>
  paths.join('/').replace(/\/+/g, '/').replace(/\/$/, '');

function filterAndMapToNavigationMenuLink(
  navItems: (MenuLink | NonMenuLink)[],
  permissions: UsePermissionsReturn,
  parentPaths: string[]
): NavigationMenuLink[] {
  return navItems.reduce((acc, navItem) => {
    const hasAccess =
      typeof navItem.hasAccess === 'function'
        ? navItem.hasAccess(permissions)
        : true;

    if (!hasAccess) return acc;

    if (navItem.type === NavObjectType.MenuLink) {
      const { title, path, children } = navItem;

      if (children) {
        const childPaths = path ? [...parentPaths, path] : parentPaths;

        const filteredChildren = filterAndMapToNavigationMenuLink(
          children,
          permissions,
          childPaths
        );

        if (filteredChildren.length > 0) {
          acc.push({ title, children: filteredChildren });
        } else if (path) {
          const fullPath = joinPaths(...parentPaths, path);
          acc.push({ title, path: fullPath });
        }
      } else if (path) {
        const fullPath = joinPaths(...parentPaths, path);
        acc.push({ title, path: fullPath });
      }
    }

    return acc;
  }, [] as NavigationMenuLink[]);
}

function filterAndMapToNavigationRootGroup(
  navItems: (RootLink | RootGroup)[],
  permissions: UsePermissionsReturn
): NavigationRootGroup[] {
  return navItems.reduce((acc, navItem) => {
    const hasAccess =
      typeof navItem.hasAccess === 'function'
        ? navItem.hasAccess(permissions)
        : true;

    if (!hasAccess) return acc;

    if (navItem.type === NavObjectType.RootGroup && navItem.children) {
      const { title, icon, info, children, path } = navItem;
      const parentPaths = path ? [path] : [];

      const filteredChildren = filterAndMapToNavigationMenuLink(
        children,
        permissions,
        parentPaths
      );

      if (filteredChildren.length > 0) {
        acc.push({ title, icon, info, path, children: filteredChildren });
      }
    } else if (navItem.type === NavObjectType.RootLink) {
      const { title, path, icon, info } = navItem;
      acc.push({ title, icon, info, path });
    }

    return acc;
  }, [] as NavigationRootGroup[]);
}

export function useNavigationConfig() {
  const { t } = useTranslation(['navigation']);
  const permissions = usePermissions();

  return useMemo(() => {
    const navCategories = getNavCategories(t);

    // 1. Combine the root groups under the same subheader
    const combinedNavCategories = navCategories.reduce((acc, navCategory) => {
      if (
        typeof navCategory.hasAccess === 'function' &&
        !navCategory.hasAccess(permissions)
      ) {
        return acc;
      }

      const subheader = navCategory.title;
      const rootGroups = navCategory.children;

      const existingSubheader = acc.find(
        ({ subheader: usedSubheader }) => usedSubheader === subheader
      );

      if (existingSubheader) {
        existingSubheader.children.push(...rootGroups);
      } else {
        acc.push({ subheader, children: rootGroups });
      }

      return acc;
    }, [] as { subheader: string; children: (RootLink | RootGroup)[] }[]);

    return combinedNavCategories.reduce((acc, { subheader, children }) => {
      const filteredChildren = filterAndMapToNavigationRootGroup(
        children,
        permissions
      );

      if (filteredChildren.length > 0) {
        acc.push({ subheader, children: filteredChildren });
      }

      return acc;
    }, [] as NavigationConfig);
  }, [permissions, t]);
}
