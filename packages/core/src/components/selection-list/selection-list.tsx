import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Checkbox,
  Box,
  IconButton,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import groupByFunction from 'lodash/groupBy';
import {
  defaultRangeExtractor,
  useVirtualizer,
  Range,
} from '@tanstack/react-virtual';
import { ChevronRightIcon } from '@tyro/icons';
import { useSelectionListState } from './store';
import { wasMultiSelectKeyUsed } from '../../utils';

interface SelectionListProps<T extends object | string> {
  options: T[];
}

type ValueOption<T extends object | string> = {
  type: 'value';
  value: T;
};

type Option<T extends object | string> =
  | { type: 'header'; value: string; groupOptionIds: string[] }
  | ValueOption<T>;

export const SelectionList = <T extends object | string>({
  options,
}: SelectionListProps<T>) => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const {
    getOptionLabel,
    getOptionId,
    groupBy,
    checkedCardIds,
    performCardAction,
    collapsibleGroups,
    expandedGroups,
    toggleGroupExpansion,
  } = useSelectionListState<T>();
  const activeGroupHeaderIndexRef = useRef(groupBy ? 0 : null);
  const previouslyClickedOption = useRef<Option<T> | null>(null);

  const optionsGrouped: Array<Option<T>> = useMemo(() => {
    if (groupBy) {
      const groupedOptions = groupByFunction(options, groupBy);
      return Object.entries(groupedOptions).reduce(
        (acc, [groupName, groupOptions]) => {
          acc.push({
            type: 'header',
            value: groupName,
            groupOptionIds: groupOptions.map((option) => getOptionId(option)),
          });

          if (!collapsibleGroups || expandedGroups.has(groupName)) {
            groupOptions.forEach((option) => {
              acc.push({
                type: 'value',
                value: option,
              });
            });
          }

          return acc;
        },
        [] as Array<Option<T>>
      );
    }

    return options.map(
      (option) =>
        ({
          type: 'value',
          value: option,
        } as const)
    );
  }, [options, groupBy, getOptionId, collapsibleGroups, expandedGroups]);

  const groupHeaderIndexes = useMemo(() => {
    if (!groupBy) return [] as number[];

    return optionsGrouped.reduce((acc, option, index) => {
      if (option.type === 'header') {
        acc.push(index);
      }

      return acc;
    }, [] as number[]);
  }, [optionsGrouped, groupBy]);

  const stickyHeaderSize = collapsibleGroups ? 46 : 36;
  const virtualizer = useVirtualizer({
    count: optionsGrouped.length,
    estimateSize: (index) =>
      optionsGrouped[index].type === 'header' ? stickyHeaderSize : 24,
    getScrollElement: () => listContainerRef.current,
    overscan: 40,
    rangeExtractor: useCallback(
      (range: Range) => {
        activeGroupHeaderIndexRef.current =
          [...groupHeaderIndexes]
            .reverse()
            .find((index) => range.startIndex >= index) ?? null;

        const next = new Set(
          activeGroupHeaderIndexRef.current !== null
            ? [
                activeGroupHeaderIndexRef.current,
                ...defaultRangeExtractor(range),
              ]
            : defaultRangeExtractor(range)
        );

        return [...next].sort((a, b) => a - b);
      },
      [groupHeaderIndexes]
    ),
  });

  const isActiveSticky = (index: number) =>
    activeGroupHeaderIndexRef.current === index;

  const performOptionAction = (
    event: React.MouseEvent<HTMLLIElement | HTMLButtonElement, MouseEvent>,
    optionIndex: number
  ) => {
    const option = optionsGrouped[optionIndex];
    const previousOption = previouslyClickedOption.current
      ? JSON.stringify(previouslyClickedOption.current)
      : null;

    const isHoldingShiftAndNotSameOption =
      wasMultiSelectKeyUsed(event) &&
      previouslyClickedOption.current &&
      previousOption !== JSON.stringify(option);

    if (isHoldingShiftAndNotSameOption) {
      const areCurrentAndPreviousBothHeaders =
        option.type === 'header' &&
        previouslyClickedOption.current?.type === 'header';
      const previousOptionIndex = optionsGrouped.findIndex(
        (currentOption) => JSON.stringify(currentOption) === previousOption
      );
      const firstIndex = Math.min(previousOptionIndex, optionIndex);
      const lastIndex = Math.max(previousOptionIndex, optionIndex);

      if (areCurrentAndPreviousBothHeaders) {
        const optionsFromGroupsIncludingClicked = groupHeaderIndexes
          .filter((index) => index >= firstIndex && index <= lastIndex)
          .flatMap((index) => {
            const groupOption = optionsGrouped[index];
            return groupOption.type === 'header'
              ? groupOption.groupOptionIds
              : [];
          });
        performCardAction(event, optionsFromGroupsIncludingClicked);
      } else {
        const optionsBetweenIndexes = optionsGrouped
          .filter(
            (currentOption, index) =>
              (currentOption.type === 'value' ||
                (currentOption.type === 'header' &&
                  !expandedGroups.has(currentOption.value))) &&
              index >= firstIndex &&
              index <= lastIndex
          )
          .flatMap((currentOption) => {
            if (currentOption.type === 'header') {
              return currentOption.groupOptionIds;
            }
            return [getOptionId(currentOption.value as unknown as T)];
          });
        performCardAction(event, optionsBetweenIndexes);
      }
    } else if (option.type === 'header') {
      performCardAction(event, option.groupOptionIds);
    } else {
      const cardId = getOptionId(option.value);
      performCardAction(event, [cardId]);
    }

    previouslyClickedOption.current = option;
  };

  const onClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    optionIndex: number
  ) => {
    if (!event.defaultPrevented && event.button === 0) {
      event.preventDefault();

      performOptionAction(event, optionIndex);
    }
  };

  useEffect(() => {
    previouslyClickedOption.current = null;
  }, [optionsGrouped]);

  return (
    <Box
      ref={listContainerRef}
      sx={{
        height: 500,
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <List
        sx={{
          height: virtualizer.getTotalSize(),
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const { index } = virtualItem;
          const option = optionsGrouped[index];

          if (option.type === 'header') {
            const groupName = option.value;
            const groupLabelId = `label-${groupName}`;
            const isAtLeastOneSelectFromGroup = option.groupOptionIds.some(
              (optionId) => checkedCardIds.has(optionId)
            );
            const isAllSelected = option.groupOptionIds.every((optionId) =>
              checkedCardIds.has(optionId)
            );

            return (
              <ListSubheader
                key={groupName}
                sx={
                  isActiveSticky(index)
                    ? { position: 'sticky !important' }
                    : {
                        transform: `translateY(${virtualItem.start}px)`,
                      }
                }
                onClick={(e) => {
                  e.stopPropagation();
                  performOptionAction(e, index);
                }}
              >
                {collapsibleGroups && (
                  <ListItemIcon>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroupExpansion(groupName);
                      }}
                    >
                      <ChevronRightIcon
                        sx={{
                          transform: expandedGroups.has(groupName)
                            ? 'rotate(90deg)'
                            : undefined,
                        }}
                      />
                    </IconButton>
                  </ListItemIcon>
                )}

                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isAllSelected}
                    indeterminate={
                      !isAllSelected && isAtLeastOneSelectFromGroup
                    }
                    inputProps={{ 'aria-labelledby': groupLabelId }}
                  />
                </ListItemIcon>
                <ListItemText id={groupLabelId} primary={groupName} />
              </ListSubheader>
            );
          }

          const optionId = getOptionId(option.value);
          const labelId = `label-${optionId}`;

          return (
            <ListItem
              key={optionId}
              onClick={(e) => onClick(e, index)}
              sx={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checkedCardIds.has(optionId)}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={getOptionLabel(option.value)}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
