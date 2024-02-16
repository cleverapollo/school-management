import {
  Button,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Grow,
  ListSubheader,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';

import { useMemo, useState, useId, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ListNavigatorSettingsParams,
  useListNavigatorSettings,
  ListNavigatorSelectOption,
  useDisclosure,
} from '../../hooks';
import { PageHeading, PageHeadingProps } from '../page-heading';
import { RouterLink } from '../router-link';
import { SearchInput } from '../search-input';

export * from './menu-items';

export type ListNavigatorProps<StoreOption extends ListNavigatorSelectOption> =
  ListNavigatorSettingsParams<StoreOption> & {
    pageHeadingProps: PageHeadingProps;
    optionTextKey?: keyof StoreOption;
    getOptionText?: (option: StoreOption) => string;
    getRenderOption?: (params: { item: StoreOption }) => React.ReactNode;
    estimateElementSize?: number;
  };

export function ListNavigator<StoreOption extends ListNavigatorSelectOption>({
  pageHeadingProps,
  optionTextKey,
  getOptionText: customGetOptionText,
  getRenderOption,
  estimateElementSize = 36,
  ...navSettingsProps
}: ListNavigatorProps<StoreOption>) {
  const id = useId();
  const { t } = useTranslation(['common']);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const listItemContainerRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchString, setSearchString] = useState('');

  const {
    storedList,
    isLoading,
    currentItem,
    getItemUrl,
    setCurrentItemId,
    getNextUrl,
    getPreviousUrl,
    setPreviousItemId,
    setNextItemId,
  } = useListNavigatorSettings(navSettingsProps);

  const links = [...(pageHeadingProps.breadcrumbs?.links || [])];
  const { parentPath, listData } = storedList;

  const getOptionText = useMemo(() => {
    if (
      process.env.NODE_ENV === 'development' &&
      !optionTextKey &&
      !customGetOptionText
    ) {
      console.error(
        'You must pass either optionTextKey or getOptionText to ListNavigator'
      );
    }

    return optionTextKey
      ? (option: StoreOption) => option[optionTextKey] as string
      : customGetOptionText;
  }, [optionTextKey, customGetOptionText]);

  const filteredItems = useMemo(() => {
    const searchStringAsLowercase = searchString.toLowerCase();
    return listData.filter((item) => {
      const optionText = getOptionText?.(item) ?? '';
      return optionText.toLowerCase().includes(searchStringAsLowercase);
    });
  }, [listData, getOptionText, searchString]);

  // const virtualizer = useVirtualizer({
  //   count: filteredItems.length ?? 0,
  //   getScrollElement: () => listItemContainerRef.current,
  //   estimateSize: () => estimateElementSize,
  //   overscan: 20,
  //   paddingEnd: 8,
  // });

  // useEffect(() => {
  //   if (isOpen && filteredItems.length > 0) {
  //     virtualizer.scrollToIndex(0);
  //   }
  // }, [isOpen, filteredItems, searchString, virtualizer]);

  // useEffect(() => {
  //   if (isOpen) {
  //     let indexToScrollTo = 0;
  //     if (currentItem?.id) {
  //       indexToScrollTo =
  //         filteredItems.findIndex((item) => item.id === currentItem.id) ?? 0;
  //     }
  //     setTimeout(() => {
  //       virtualizer.scrollToOffset(indexToScrollTo * estimateElementSize);
  //     }, 0);
  //   } else {
  //     setSearchString('');
  //   }
  // }, [isOpen]);

  // const virtualItems = virtualizer.getVirtualItems();

  const nextUrl = getNextUrl();
  const prevUrl = getPreviousUrl();

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
              component={Link}
              startIcon={<ChevronLeftIcon sx={{ width: 24, height: 24 }} />}
              color="primary"
              variant="text"
              sx={{
                '.MuiButton-startIcon': {
                  marginRight: 0,
                },
              }}
              to={prevUrl ?? ''}
              onClick={setPreviousItemId}
              disabled={!prevUrl}
            >
              {t('common:actions.previous')}
            </Button>

            <Button
              ref={anchorEl}
              id={id}
              variant="soft"
              aria-expanded={isOpen ? 'true' : undefined}
              aria-controls={isOpen ? `${id}-menu` : undefined}
              aria-haspopup="true"
              endIcon={<ChevronDownIcon />}
              onClick={onOpen}
            >
              {isLoading && <CircularProgress size={16} sx={{ mr: 1 }} />}
              {currentItem ? getOptionText?.(currentItem) : ''}
            </Button>
            <Popper
              open={isOpen}
              anchorEl={anchorEl.current}
              role={undefined}
              placement="bottom"
              transition
              disablePortal
              sx={{
                zIndex: 'modal',
              }}
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  timeout={350}
                  style={{
                    transformOrigin: 'center top',
                  }}
                >
                  <Paper
                    ref={listItemContainerRef}
                    sx={({ customShadows }) => ({
                      minHeight: 172,
                      maxHeight: 'min(calc(100vh - 96px), 400px)',
                      position: 'relative',
                      overflow: 'auto',
                      mt: 1,
                      boxShadow: customShadows.dropdown,
                    })}
                  >
                    <ClickAwayListener onClickAway={onClose}>
                      <Stack>
                        <ListSubheader
                          component={Stack}
                          sx={{
                            pt: 1,
                            px: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                          }}
                        >
                          <Stack
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={4}
                            pb={0.5}
                          >
                            {parentPath?.href && (
                              <Button
                                variant="text"
                                size="small"
                                component={RouterLink}
                                to={parentPath?.href}
                                startIcon={<ArrowLeftIcon />}
                                sx={{
                                  '.MuiButton-startIcon': {
                                    marginRight: 0.25,
                                  },
                                }}
                              >
                                {t('common:profileNavigation.breadcrumbPage', {
                                  name: parentPath.name,
                                })}
                              </Button>
                            )}
                            <Stack flexDirection="row" gap={0.5}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="bold"
                              >
                                {t(
                                  `common:profileNavigation.${navSettingsProps.type}`
                                )}
                              </Typography>
                              <Typography variant="body2">
                                ({listData.length})
                              </Typography>
                            </Stack>
                          </Stack>
                          <SearchInput
                            value={searchString}
                            onChange={(event) => {
                              setSearchString(event.target.value);
                            }}
                          />
                        </ListSubheader>
                        {filteredItems.length === 0 ? (
                          <Stack
                            sx={{
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              minHeight: 80,
                            }}
                          >
                            <Typography
                              variant="body1"
                              component="span"
                              color="text.secondary"
                            >
                              {t(`common:noResultsFound`)}
                            </Typography>
                          </Stack>
                        ) : (
                          <MenuList
                            variant="selectedMenu"
                            id={`${id}-menu`}
                            aria-labelledby={id}
                            // sx={{
                            //   pt: 0,
                            //   height: `${virtualizer.getTotalSize()}px`,
                            // }}
                          >
                            {/**  eslint-disable-next-line arrow-body-style */}
                            {filteredItems.map((item) => (
                              // const item = filteredItems[virtualRow.index];

                              <MenuItem
                                // key={virtualRow.key}
                                key={item.id}
                                component={Link}
                                // data-index={virtualRow.index}
                                // ref={virtualizer.measureElement}
                                selected={item.id === currentItem.id}
                                to={getItemUrl(item) ?? ''}
                                onClick={() => {
                                  setCurrentItemId(item.id);
                                  onClose();
                                }}
                                // sx={{
                                //   position: 'absolute',
                                //   width: 'calc(100% - 16px)',
                                //   top: 0,
                                //   transform: `translateY(${virtualRow.start}px)`,
                                // }}
                              >
                                {getRenderOption?.({ item }) ??
                                  getOptionText?.(item) ??
                                  ''}
                              </MenuItem>
                            ))}
                          </MenuList>
                        )}
                      </Stack>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <Button
              component={Link}
              endIcon={<ChevronRightIcon sx={{ width: 24, height: 24 }} />}
              color="primary"
              variant="text"
              sx={{
                '.MuiButton-endIcon': {
                  marginLeft: 0,
                },
              }}
              to={nextUrl ?? ''}
              disabled={!nextUrl}
              onClick={setNextItemId}
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
