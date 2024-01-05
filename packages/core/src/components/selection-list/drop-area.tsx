import { useMemo } from 'react';
import { Typography, Card, Stack, Button, Fade, Chip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { SearchInput } from '../search-input';
import { SelectionList } from './selection-list';
import { useSelectionListState } from './store';
import { LoadingPlaceholderContainer } from '../loading-placeholder';

export type SelectListDropAreaProps = {
  droppableId: 'unselected' | 'selected';
  emptyMessage?: string;
  isLoading?: boolean;
};

const getListStyle = ({ isGrouped }: { isGrouped: boolean }) =>
  ({
    flex: 1,
    borderRadius: 2,
    pt: 2,
    px: 2,

    '& ul': {
      pt: 0,
    },

    '& li': {
      px: 1,

      '&.MuiListSubheader-root': {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        pt: 1,
        pb: 0.5,

        '& .MuiTypography-root': {
          fontWeight: 700,
        },

        '& .MuiCheckbox-root': {
          '&:not(.Mui-checked, .MuiCheckbox-indeterminate)': {
            color: 'slate.400',
          },
          p: 0,
          ml: -0.25,
          mr: 0.5,
        },

        '& .MuiListItemIcon-root': {
          mr: 0.5,
        },
      },

      '&.MuiListItem-root': {
        ml: isGrouped ? 8 : 0,
        position: 'absolute',
        top: 0,
        width: 'fit-content',
        py: 0,

        '& .MuiCheckbox-root': {
          '&:not(.Mui-checked, .MuiCheckbox-indeterminate)': {
            color: 'slate.400',
          },
          p: 0,
          ml: -0.25,
          mr: 1,
        },

        '& .MuiListItemIcon-root': {
          mr: 0.5,
        },
      },
    },
  } as const);

export const SelectListDropArea = <T extends object | string>({
  droppableId,
  emptyMessage,
  isLoading,
}: SelectListDropAreaProps) => {
  const { t } = useTranslation(['common']);
  const {
    getOptionLabel,
    showSearch,
    unselectedOptions,
    selectedOptions,
    selectedSearch,
    setSelectedSearch,
    unselectedSearch,
    setUnselectedSearch,
    optionsCheckToMoveToSelected,
    optionsCheckToMoveToUnselected,
    moveToSelected,
    moveToUnselected,
    groupBy,
  } = useSelectionListState<T>();
  const {
    options,
    searchValue,
    setSearchValue,
    enableMoveButton,
    numberOfSelectedOptions,
    onMove,
  } =
    droppableId === 'unselected'
      ? {
          options: unselectedOptions,
          searchValue: unselectedSearch,
          setSearchValue: setUnselectedSearch,
          enableMoveButton: optionsCheckToMoveToSelected.length > 0,
          numberOfSelectedOptions: optionsCheckToMoveToSelected.length,
          onMove: moveToSelected,
        }
      : {
          options: selectedOptions,
          searchValue: selectedSearch,
          setSearchValue: setSelectedSearch,
          enableMoveButton: optionsCheckToMoveToUnselected.length > 0,
          numberOfSelectedOptions: optionsCheckToMoveToUnselected.length,
          onMove: moveToUnselected,
        };

  const filteredOptions = useMemo(() => {
    if (searchValue === '') {
      return options;
    }

    return options.filter((option) => {
      const optionLabel = getOptionLabel(option);

      return optionLabel.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [options, showSearch, searchValue, getOptionLabel]);

  return (
    <Card
      variant="outlined"
      sx={getListStyle({
        isGrouped: Boolean(groupBy),
      })}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        {showSearch && (
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
        <Fade in={enableMoveButton}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={numberOfSelectedOptions}
                variant="soft"
                color="primary"
                size="small"
                sx={{ borderRadius: 0.75, fontWeight: 700 }}
              />
              <Typography
                component="span"
                variant="subtitle2"
                color="indigo.600"
              >
                {t('common:selected')}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={onMove}
              sx={{
                postion: 'relative',
                zIndex: 2,
              }}
            >
              {droppableId === 'unselected'
                ? t('common:actions.add')
                : t('common:actions.remove')}
            </Button>
          </Stack>
        </Fade>
      </Stack>
      <LoadingPlaceholderContainer
        isLoading={!!isLoading}
        sx={{ position: 'relative', height: 500 }}
      >
        {filteredOptions.length > 0 ? (
          <SelectionList options={filteredOptions} />
        ) : (
          <Stack
            sx={{
              height: 500,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>{emptyMessage}</Typography>
          </Stack>
        )}
      </LoadingPlaceholderContainer>
    </Card>
  );
};
