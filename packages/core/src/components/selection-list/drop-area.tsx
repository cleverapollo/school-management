import { useMemo, useState } from 'react';
import groupByFunction from 'lodash/groupBy';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Theme, useTheme, Typography } from '@mui/material';
import get from 'lodash/get';
import { SearchInput } from '../search-input';
import { GroupedDraggableSelectionList } from './draggable-lists';

export type SelectListDropAreaProps<T extends object | string> = {
  droppableId: string;
  label: string;
  variant: 'selection' | 'ordering';
  options: T[];
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  getOptionLabel: (option: T) => string;
  showSearch?: boolean;
};

const getListStyle = ({ customShadows }: Theme, isDraggingOver: boolean) =>
  ({
    backgroundColor: isDraggingOver ? 'indigo.200' : 'background.paper',
    boxShadow: customShadows.card,
    borderRadius: 2,
    paddingY: 0.75,
    paddingX: 1.5,
  } as const);

export const SelectListDropArea = <T extends object | string>({
  variant,
  droppableId,
  label,
  options,
  groupBy,
  getOptionLabel,
  showSearch,
}: SelectListDropAreaProps<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const theme = useTheme();

  const filteredOptions = useMemo(() => {
    if (searchValue === '') {
      return options;
    }

    return options.filter((option) => {
      const optionLabel = getOptionLabel(option);

      if (typeof optionLabel === 'string') {
        return optionLabel.toLowerCase().includes(searchValue.toLowerCase());
      }

      return false;
    });
  }, [options, showSearch, searchValue, getOptionLabel]);

  const groupedOptions = useMemo(() => {
    if (!groupBy) {
      return filteredOptions;
    }

    const sortedOptions =
      variant === 'selection'
        ? filteredOptions.sort((a, b) => {
            const typedGroupBy = groupBy as keyof T | ((option: T) => string);
            const aGroup =
              typeof typedGroupBy === 'function'
                ? typedGroupBy(a)
                : (get(a, typedGroupBy) as string);
            const bGroup =
              typeof typedGroupBy === 'function'
                ? typedGroupBy(b)
                : (get(b, typedGroupBy) as string);

            if (aGroup !== bGroup) {
              return aGroup.toLowerCase().localeCompare(bGroup.toLowerCase());
            }

            return getOptionLabel(a).localeCompare(getOptionLabel(b));
          })
        : filteredOptions;

    return groupByFunction(sortedOptions, groupBy);
  }, [variant, filteredOptions, groupBy]);

  return (
    <Droppable droppableId={droppableId} type="group">
      {(provided, snapshot) => (
        <Box sx={getListStyle(theme, snapshot.isDraggingOver)}>
          <Typography component="h3" variant="h6" fontSize="1rem">
            {label}
          </Typography>
          {showSearch && (
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          )}
          {Array.isArray(groupedOptions) ? null : (
            <GroupedDraggableSelectionList
              groups={groupedOptions}
              getOptionLabel={getOptionLabel}
            />
          )}
        </Box>
      )}
    </Droppable>
  );
};
