import { TFunction } from '@tyro/i18n';
import { PermissionUtils, UsePermissionsReturn } from '@tyro/api';
import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

export enum NavObjectType {
  Category = 'CATEGORY',
  RootLink = 'ROOT_LINK',
  RootGroup = 'ROOT_GROUP',
  MenuLink = 'MENU_LINK',
  NonMenuLink = 'NON_MENU_LINK',
}

export type HasAccessFunction = (permissions: PermissionUtils) => boolean;

// NonMenuLink is a link that is not in a menu

interface NonIndexNonMenuLink extends Omit<NonIndexRouteObject, 'children'> {
  type: NavObjectType.NonMenuLink;
  children?: NonMenuLink[];
  hasAccess?: HasAccessFunction;
}
interface IndexNonMenuLink extends IndexRouteObject {
  type: NavObjectType.NonMenuLink;
  hasAccess?: HasAccessFunction;
}

export type NonMenuLink = NonIndexNonMenuLink | IndexNonMenuLink;

// MenuLink is a link that is in a menu

interface NonIndexMenuLink extends Omit<NonIndexRouteObject, 'children'> {
  type: NavObjectType.MenuLink;
  title: string;
  children?: NonMenuLink[];
  hasAccess?: HasAccessFunction;
}
interface IndexMenuLink extends IndexRouteObject {
  type: NavObjectType.MenuLink;
  title: string;
  hasAccess?: HasAccessFunction;
}

export type MenuLink = NonIndexMenuLink | IndexMenuLink;

// RootGroup is a group on the menu with a title and icon and holders Menu and NonMenuLinks

interface NonIndexRootGroup extends Omit<NonIndexRouteObject, 'children'> {
  type: NavObjectType.RootGroup;
  title: string;
  icon: JSX.Element;
  info?: JSX.Element;
  children: (MenuLink | NonMenuLink)[];
  hasAccess?: HasAccessFunction;
}

interface IndexRootGroup extends IndexRouteObject {
  type: NavObjectType.RootGroup;
  title: string;
  icon: JSX.Element;
  info?: JSX.Element;
  hasAccess?: HasAccessFunction;
}

export type RootGroup = NonIndexRootGroup | IndexRootGroup;

// RootLink is a link on the menu with a title and icon and doesn't show any children on the menu

interface NonIndexRootLink extends Omit<NonIndexRouteObject, 'children'> {
  type: NavObjectType.RootLink;
  title: string;
  icon: JSX.Element;
  info?: JSX.Element;
  children?: NonMenuLink[];
  hasAccess?: HasAccessFunction;
}

interface IndexRootLink extends IndexRouteObject {
  type: NavObjectType.RootLink;
  title: string;
  icon: JSX.Element;
  info?: JSX.Element;
  hasAccess?: HasAccessFunction;
}

export type RootLink = NonIndexRootLink | IndexRootLink;

// NavCategory is a category on the menu with a title and holds RootLinks and RootGroups

export interface NavCategory {
  type: NavObjectType.Category;
  title: string;
  children: (RootLink | RootGroup)[];
  hasAccess?: HasAccessFunction;
}

export type NavObjectFunction = (
  t: TFunction<'navigation'[], undefined, 'navigation'[]>
) => NavCategory[];
