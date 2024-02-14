import { Button, Divider, Stack, Typography } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

import {
  ProfileListNavigationParams,
  useProfileListNavigation,
  usePreferredNameLayout,
  PreferredNameFormat,
} from '../../hooks';
import { PageHeading, PageHeadingProps } from '../page-heading';
import { RouterLink } from '../router-link';
import { Select } from '../select';

type ProfileListNavigationProps = ProfileListNavigationParams & {
  pageHeadingProps: PageHeadingProps;
};

export function ProfileListNavigation({
  profile,
  profileId,
  pageHeadingProps,
}: ProfileListNavigationProps) {
  const { t } = useTranslation(['common']);
  const { displayName } = usePreferredNameLayout();

  const {
    storedList,
    isLoading,
    currentItem,
    moveToIndex,
    moveToPrev,
    moveToNext,
  } = useProfileListNavigation({ profile, profileId });

  const links = [...(pageHeadingProps.breadcrumbs?.links || [])];
  const { parentPath, listData } = storedList;

  return (
    <Stack gap={1}>
      {currentItem && listData.length > 1 ? (
        <>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              startIcon={<ChevronLeftIcon sx={{ width: 24, height: 24 }} />}
              color="primary"
              variant="text"
              sx={{
                '.MuiButton-startIcon': {
                  marginRight: 0,
                },
              }}
              onClick={moveToPrev}
            >
              {t('common:actions.back')}
            </Button>

            <Select
              optionIdKey="partyId"
              aria-label={t(`common:profileNavigation.${profile}`)}
              loading={isLoading}
              options={storedList.listData}
              value={currentItem.partyId}
              size="small"
              variant="soft"
              hiddenLabel
              headerComponent={
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1.5}
                  py={0.5}
                >
                  <Stack flexDirection="row" gap={1}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {t(`common:profileNavigation.${profile}`)}
                    </Typography>
                    <Typography variant="body2">({listData.length})</Typography>
                  </Stack>
                  {parentPath?.href && (
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={parentPath?.href}
                    >
                      {t('common:profileNavigation.breadcrumbPage', {
                        name: parentPath.name,
                      })}
                    </Button>
                  )}
                </Stack>
              }
              renderValue={({ name, person }) => (
                <Stack direction="row" gap={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight="bold">
                    {name ||
                      displayName(person, {
                        format: PreferredNameFormat.FirstnameSurname,
                      })}
                  </Typography>
                </Stack>
              )}
              renderAvatarOption={(
                { name, person, avatarUrl, caption, captionProps, avatarProps },
                renderOption
              ) =>
                renderOption({
                  ...avatarProps,
                  name:
                    name ||
                    displayName(person, {
                      format: PreferredNameFormat.FirstnameSurname,
                    }),
                  src: person?.avatarUrl || avatarUrl || avatarProps?.src,
                  hideAvatar: Boolean(!person && !avatarProps),
                  caption,
                  captionProps,
                })
              }
              onChange={(event) => {
                moveToIndex(Number(event?.target.value));
              }}
            />
            <Button
              endIcon={<ChevronRightIcon sx={{ width: 24, height: 24 }} />}
              color="primary"
              variant="text"
              sx={{
                '.MuiButton-endIcon': {
                  marginLeft: 0,
                },
              }}
              onClick={moveToNext}
            >
              {t('common:actions.next')}
            </Button>
          </Stack>
          <Divider sx={{ borderColor: 'indigo.200' }} />
        </>
      ) : null}
      <PageHeading
        {...pageHeadingProps}
        breadcrumbs={{
          ...pageHeadingProps.breadcrumbs,
          links: parentPath ? [parentPath, ...links.slice(1)] : links,
        }}
      />
    </Stack>
  );
}
