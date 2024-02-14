import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from 'react-use';
import { useLocation, useNavigate } from 'react-router-dom';
import { TypographyProps } from '@mui/material';
import { Person } from '@tyro/api';
import { TLink } from '../components/breadcrumbs/link-item';
import { AvatarProps } from '../components';

export enum ProfilePageNavigation {
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

export type ProfileSelectOption = {
  partyId: number;
  person?: Partial<Person>;
  name?: string;
  avatarUrl?: string | null;
  caption?: string | null;
  captionProps?: TypographyProps;
  avatarProps?: AvatarProps;
  url?: string;
};

export type ProfileListNavigationParams = {
  profile: ProfilePageNavigation;
  profileId?: number;
};

export type StoredList = {
  parentPath?: TLink;
  listData: Array<ProfileSelectOption>;
};

export function useProfileListNavigation({
  profile,
  profileId,
}: ProfileListNavigationParams) {
  const navigate = useNavigate();
  const location = useLocation();

  const storeKey = `tyro:profile-list-navigation:${profile}`;

  const [storedList, setStoredList] = useSessionStorage<StoredList>(storeKey, {
    listData: [],
  });

  const findItemIndex = useCallback(
    (itemId?: number) =>
      storedList.listData.findIndex((v) => v.partyId === itemId) ?? 0,
    [storedList.listData]
  );

  const [currentIndex, setCurrentIndex] = useState(findItemIndex(profileId));

  const currentItem = useMemo(
    () => storedList.listData[currentIndex],
    [storedList.listData, currentIndex]
  );

  useEffect(() => {
    if (profileId && !currentItem) {
      setStoredList({ listData: [] });
    }
  }, [currentItem, profileId]);

  useEffect(() => {
    const newId = currentItem?.partyId;

    if (profileId && profileId !== newId && currentIndex > -1) {
      const url = location.pathname.replace(`${profileId}`, `${newId}`);

      navigate(currentItem?.url || url);
    }
  }, [currentIndex]);

  const storeList = useCallback(
    (routeName?: string, data?: Array<ProfileSelectOption>) => {
      const parentPath = location.pathname;

      setStoredList({
        parentPath: {
          name: routeName || '',
          href: parentPath,
        },
        listData: (data || []).map(({ url, ...dataUrl }) => ({
          ...dataUrl,
          ...(url && {
            url: `${parentPath}/${url.replace(/^\.\//, '')}`,
          }),
        })),
      });
    },
    [location.pathname]
  );

  const moveToIndex = useCallback(
    (itemId?: number) => {
      setCurrentIndex(findItemIndex(itemId));
    },
    [findItemIndex]
  );

  const moveToPrev = useCallback(() => {
    if (currentIndex === 0 && storedList.parentPath?.href) {
      return navigate(storedList.parentPath?.href);
    }

    return setCurrentIndex((index) => index - 1);
  }, [currentIndex]);

  const moveToNext = useCallback(() => {
    if (currentIndex === storedList.listData.length - 1) {
      return setCurrentIndex(0);
    }

    return setCurrentIndex((index) => index + 1);
  }, [currentIndex]);

  return {
    isLoading: profileId !== currentItem?.partyId,
    currentItem,
    currentIndex,
    storedList,
    storeList,
    moveToIndex,
    moveToNext,
    moveToPrev,
  };
}
