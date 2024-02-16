import { MenuItem, MenuList } from '@mui/material';
import { Link } from 'react-router-dom';

import { useId, memo, useCallback, useEffect } from 'react';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { ListNavigatorSelectOption } from '../../hooks';

export type VirtualizedListProps<
  StoreOption extends ListNavigatorSelectOption
> = {
  estimateElementSize?: number;
  filteredItems: (StoreOption & {
    renderedOption: React.ReactNode;
    to: string;
  })[];
  containerRef: HTMLDivElement | null;
  currentItemId: StoreOption['id'];
  onSelectItem: (newItem: StoreOption['id']) => void;
};

function VirtualizedListInner<StoreOption extends ListNavigatorSelectOption>({
  filteredItems,
  containerRef,
  currentItemId,
  onSelectItem,
  estimateElementSize = 52,
}: VirtualizedListProps<StoreOption>) {
  const id = useId();

  const virtualizer = useVirtualizer({
    count: filteredItems.length ?? 0,
    getScrollElement: useCallback(() => containerRef, [containerRef]),
    estimateSize: useCallback(() => estimateElementSize, [estimateElementSize]),
    overscan: 8,
  });

  const renderItem = useCallback(
    (
      virtualRow: VirtualItem,
      item: VirtualizedListProps<StoreOption>['filteredItems'][number]
    ) => (
      <MenuItem
        key={virtualRow.key}
        component={Link}
        data-index={virtualRow.index}
        ref={virtualizer.measureElement}
        selected={item.id === currentItemId}
        to={item.to}
        onClick={() => onSelectItem(item.id)}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'calc(100% - 16px)',
          transform: `translateY(${virtualRow.start}px)`,
        }}
      >
        {item.renderedOption}
      </MenuItem>
    ),
    [currentItemId]
  );

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const indexToScrollTo = filteredItems.findIndex(
      (item) => item.id === currentItemId
    );
    setTimeout(() => {
      virtualizer.scrollToIndex(indexToScrollTo + 3);
    }, 0);
  }, [currentItemId]);

  return (
    <MenuList
      variant="selectedMenu"
      id={`${id}-menu`}
      aria-labelledby={id}
      sx={{
        pt: 0,
        height: `${virtualizer.getTotalSize()}px`,
        position: 'relative',
      }}
    >
      {virtualItems.map((virtualRow) =>
        renderItem(virtualRow, filteredItems[virtualRow.index])
      )}
    </MenuList>
  );
}

export const VirtualizedList = memo(VirtualizedListInner);
