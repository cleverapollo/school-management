import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from 'react-use';
import { useLocation, Location } from 'react-router-dom';
import { TLink } from '../components/breadcrumbs/link-item';

export enum ListNavigatorType {
  Student = 'STUDENT',
  Contact = 'CONTACT',
  Staff = 'STAFF',
  YearGroup = 'YEAR_GROUP',
  ClassGroup = 'CLASS_GROUP',
  SubjectGroup = 'SUBJECT_GROUP',
  SupportGroup = 'SUPPORT_GROUP',
  CustomGroup = 'CUSTOM_GROUP',
  Assessment = 'ASSESSMENT',
}

export type ListNavigatorSelectOption = {
  id: number | string;
  [key: string]: unknown;
};

export type ListNavigatorSettingsParams<
  StoreOption extends ListNavigatorSelectOption
> = {
  type: ListNavigatorType;
  itemId?: StoreOption['id'];
  getNavigationUrl?: (navState: {
    currentLocation: Location<unknown>;
    currentItem: StoreOption;
    newItem: StoreOption;
  }) => string | undefined;
  defaultListData?: Array<StoreOption>;
};

function defaultGetNavigationUrl<
  StoreOption extends ListNavigatorSelectOption
>({
  currentLocation,
  currentItem,
  newItem,
}: {
  currentLocation: Location<unknown>;
  currentItem: StoreOption;
  newItem: StoreOption;
}) {
  if (currentItem && newItem) {
    return currentLocation.pathname.replace(
      `${currentItem.id}`,
      `${newItem.id}`
    );
  }
  return currentLocation.pathname;
}

export type StoredList<StoreOption extends ListNavigatorSelectOption> = {
  parentPath?: TLink;
  listData: Array<StoreOption>;
};

export function useListNavigatorSettings<
  StoreOption extends ListNavigatorSelectOption
>({
  type,
  itemId,
  getNavigationUrl = defaultGetNavigationUrl,
  defaultListData = [],
}: ListNavigatorSettingsParams<StoreOption>) {
  const location = useLocation();

  const storeKey = `tyro:profile-list-navigation:${type}`;

  const [currentItemId, setCurrentItemId] = useState<
    StoreOption['id'] | undefined
  >(itemId);
  const [storedList, setStoredList] = useSessionStorage<
    StoredList<StoreOption>
  >(storeKey, {
    listData: defaultListData,
  });

  const listById = useMemo(
    () => new Map(storedList.listData.map((v) => [v.id, v])),
    [storedList.listData]
  );

  const getItemIndexByItemId = useCallback(
    (id?: StoreOption['id']) =>
      storedList.listData.findIndex((v) => v.id === id) ?? 0,
    [storedList.listData]
  );

  const storeList = useCallback(
    (routeName: string | undefined, data: Array<StoreOption> | undefined) => {
      const parentPath = location.pathname;

      setStoredList({
        parentPath: {
          name: routeName || '',
          href: parentPath,
        },
        listData: data ?? [],
      });
    },
    [location.pathname]
  );

  const getItemUrl = useCallback(
    (newItem: StoreOption) => {
      const currentItem = listById.get(itemId ?? '');

      const newUrl = getNavigationUrl({
        currentLocation: location,
        currentItem: currentItem || newItem,
        newItem,
      });

      return newUrl;
    },
    [listById, itemId, location]
  );

  const getPreviousUrl = useCallback(() => {
    const currentItemIndex = getItemIndexByItemId(itemId);
    if (currentItemIndex === 0) return null;

    return getItemUrl(storedList.listData[currentItemIndex - 1]);
  }, [itemId, storedList, getItemIndexByItemId, getItemUrl]);

  const getNextUrl = useCallback(() => {
    const currentItemIndex = getItemIndexByItemId(itemId);
    if (currentItemIndex === storedList.listData.length - 1) return null;

    return getItemUrl(storedList.listData[currentItemIndex + 1]);
  }, [itemId, storedList, getItemIndexByItemId, getItemUrl]);

  const setPreviousItemId = useCallback(() => {
    const currentItemIndex = getItemIndexByItemId(itemId);
    if (currentItemIndex === 0) return;

    setCurrentItemId(storedList.listData[currentItemIndex - 1].id);
  }, [itemId, storedList, getItemIndexByItemId]);

  const setNextItemId = useCallback(() => {
    const currentItemIndex = getItemIndexByItemId(itemId);
    if (currentItemIndex === storedList.listData.length - 1) return;

    setCurrentItemId(storedList.listData[currentItemIndex + 1].id);
  }, [itemId, storedList, getItemIndexByItemId]);

  useEffect(() => {
    if (itemId && !listById.get(itemId)) {
      setStoredList({ listData: [] });
    }

    setCurrentItemId(itemId);
  }, [itemId]);

  useEffect(() => {
    if (storedList.listData.length === 0) {
      setStoredList({ listData: defaultListData });
    }
  }, [defaultListData.length]);

  return {
    isLoading: itemId !== currentItemId,
    currentItem: listById.get(currentItemId ?? ''),
    setCurrentItemId,
    storedList,
    storeList,
    getPreviousUrl,
    getNextUrl,
    getItemUrl,
    setPreviousItemId,
    setNextItemId,
  };
}
