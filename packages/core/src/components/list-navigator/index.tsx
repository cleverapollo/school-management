import {
  Button,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Grow,
  ListSubheader,
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

import {
  useMemo,
  useState,
  useId,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  ListNavigatorSettingsParams,
  useListNavigatorSettings,
  ListNavigatorSelectOption,
  useDisclosure,
} from '../../hooks';
import { PageHeading, PageHeadingProps } from '../page-heading';
import { RouterLink } from '../router-link';
import { SearchInput } from '../search-input';
import { VirtualizedList } from './virtualized-list';

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
  estimateElementSize = 44,
  ...navSettingsProps
}: ListNavigatorProps<StoreOption>) {
  const id = useId();
  const { t } = useTranslation(['common']);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
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

  const listDataWithRenderedOptions = useMemo(
    () =>
      listData.map((item) => ({
        ...item,
        to: getItemUrl(item) ?? '',
        renderedOption:
          getRenderOption?.({ item }) ?? getOptionText?.(item) ?? '',
      })),
    [listData, getItemUrl, getRenderOption, getOptionText]
  );

  const filteredItems = useMemo(() => {
    const searchStringAsLowercase = searchString.toLowerCase();
    return listDataWithRenderedOptions.filter((item) => {
      const optionText = getOptionText?.(item) ?? '';
      return optionText.toLowerCase().includes(searchStringAsLowercase);
    });
  }, [listDataWithRenderedOptions, getOptionText, searchString]);

  const handleSelectItem = useCallback((item: StoreOption['id']) => {
    setCurrentItemId(item);
    onClose();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchString('');
    }
  }, [isOpen]);

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
                <ClickAwayListener onClickAway={onClose}>
                  <Grow
                    {...TransitionProps}
                    timeout={350}
                    style={{
                      transformOrigin: 'center top',
                    }}
                  >
                    <Stack
                      ref={setContainerRef}
                      sx={({ customShadows, palette }) => ({
                        minHeight: 172,
                        maxHeight: 'min(calc(100vh - 96px), 400px)',
                        position: 'relative',
                        overflow: 'auto',
                        mt: 1,
                        borderRadius: 1,
                        boxShadow: customShadows.dropdown,
                        backgroundColor: palette.background.paper,
                      })}
                    >
                      <ListSubheader
                        ref={headerRef}
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
                        containerRef && (
                          <VirtualizedList
                            containerRef={containerRef}
                            headerHeight={headerRef.current?.clientHeight ?? 0}
                            filteredItems={filteredItems}
                            currentItemId={currentItem.id}
                            onSelectItem={handleSelectItem}
                            estimateElementSize={estimateElementSize}
                          />
                        )
                      )}
                    </Stack>
                  </Grow>
                </ClickAwayListener>
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
