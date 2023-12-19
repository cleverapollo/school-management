import { useMemo, useState } from 'react';
import groupByFunction from 'lodash/groupBy';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Theme, useTheme, Typography, Card } from '@mui/material';
import get from 'lodash/get';
import { SearchInput } from '../search-input';
import { GroupedDraggableSelectionList } from './draggable-lists';

export type SelectListDropAreaProps<T extends object | string> = {
  droppableId: 'unselected' | 'selected';
  label: string;
  variant: 'selection' | 'ordering';
  options: T[];
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  getOptionLabel: (option: T) => string;
  getOptionId: (option: T) => string;
  showSearch?: boolean;
};

const getListStyle = ({
  theme: { palette },
  isDraggingOver,
  droppableId,
}: {
  theme: Theme;
  isDraggingOver: boolean;
  droppableId: 'unselected' | 'selected';
}) => {
  const backgroundColor = droppableId === 'selected' ? 'slate.100' : 'white';
  const listItemBackgroundColor =
    droppableId === 'selected' ? 'white' : 'slate.100';
  const listItemBoxShadow =
    droppableId === 'selected' ? 'none' : `0 1px 0 0 ${palette.slate[200]}`;

  return {
    backgroundColor: isDraggingOver ? 'indigo.200' : backgroundColor,
    flex: 1,
    borderRadius: 2,
    paddingY: 0.75,
    paddingX: 1.5,
    '& li': {
      px: 1,
      py: 0.5,

      '&.MuiListItem-root': {
        borderRadius: 1,
        my: 1,
        backgroundColor: listItemBackgroundColor,
        boxShadow: listItemBoxShadow,
        width: 'fit-content',

        '& .MuiTypography-root': {
          fontWeight: 600,
        },
      },
    },
  } as const;
};

export const SelectListDropArea = <T extends object | string>({
  variant,
  droppableId,
  label,
  options,
  groupBy,
  getOptionLabel,
  getOptionId,
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
        <Card
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={getListStyle({
            theme,
            droppableId,
            isDraggingOver: snapshot.isDraggingOver,
          })}
        >
          <Typography component="h3" variant="subtitle1" fontWeight={700}>
            {label}
          </Typography>
          {showSearch && (
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          )}
          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            {Array.isArray(groupedOptions) ? null : (
              <GroupedDraggableSelectionList
                groups={groupedOptions}
                getOptionLabel={getOptionLabel}
                getOptionId={getOptionId}
              />
            )}
            {provided.placeholder}
          </Box>
        </Card>
      )}
    </Droppable>
  );
};
