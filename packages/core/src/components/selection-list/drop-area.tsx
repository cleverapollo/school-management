import { useMemo } from 'react';
import {
  Theme,
  useTheme,
  Typography,
  Card,
  Stack,
  Button,
  Fade,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ArrowLeftIcon, ArrowRightIcon } from '@tyro/icons';
import { SearchInput } from '../search-input';
import { SelectionList } from './selection-list';
import { useSelectionListState } from './store';

export type SelectListDropAreaProps = {
  droppableId: 'unselected' | 'selected';
  label: string;
};

const getListStyle = ({
  theme: { palette },
  droppableId,
  isGrouped,
}: {
  theme: Theme;
  droppableId: 'unselected' | 'selected';
  isGrouped: boolean;
}) =>
  ({
    flex: 1,
    borderRadius: 2,
    pt: 1.5,
    px: 1.5,

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
          p: 0,
          ml: -0.25,
          mr: 0.5,
        },

        '& .MuiListItemIcon-root': {
          mr: 0.5,
        },
      },

      '&.MuiListItem-root': {
        ml: isGrouped ? 1 : 0,
        position: 'absolute',
        top: 0,
        width: 'fit-content',
        py: 0,

        '& .MuiCheckbox-root': {
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
  label,
}: SelectListDropAreaProps) => {
  const theme = useTheme();
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
    enableMoveToSelectedButton,
    enabledMoveToUnselectedButton,
    moveToSelected,
    moveToUnselected,
    groupBy,
  } = useSelectionListState<T>();
  const { options, searchValue, setSearchValue, enableMoveButton, onMove } =
    droppableId === 'unselected'
      ? {
          options: unselectedOptions,
          searchValue: unselectedSearch,
          setSearchValue: setUnselectedSearch,
          enableMoveButton: enableMoveToSelectedButton,
          onMove: moveToSelected,
        }
      : {
          options: selectedOptions,
          searchValue: selectedSearch,
          setSearchValue: setSelectedSearch,
          enableMoveButton: enabledMoveToUnselectedButton,
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
        theme,
        droppableId,
        isGrouped: Boolean(groupBy),
      })}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          component="h3"
          variant="subtitle1"
          fontWeight={700}
          lineHeight={1.875}
        >
          {label}
        </Typography>
        <Fade in={enableMoveButton}>
          <Button
            variant={droppableId === 'unselected' ? 'contained' : 'outlined'}
            startIcon={
              droppableId === 'selected' ? <ArrowLeftIcon /> : undefined
            }
            endIcon={
              droppableId === 'unselected' ? <ArrowRightIcon /> : undefined
            }
            size="small"
            onClick={onMove}
          >
            {droppableId === 'unselected'
              ? t('common:actions.add')
              : t('common:actions.remove')}
          </Button>
        </Fade>
      </Stack>
      {showSearch && (
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            my: 1,
          }}
        />
      )}
      <SelectionList options={filteredOptions} />
    </Card>
  );
};
