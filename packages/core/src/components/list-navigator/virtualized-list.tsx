import { MenuItem, MenuList } from '@mui/material';
import { Link } from 'react-router-dom';

import { useId, memo, useCallback, useEffect, useRef } from 'react';
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
  containerRef: HTMLDivElement;
  headerHeight: number;
  currentItemId: StoreOption['id'];
  onSelectItem: (newItem: StoreOption['id']) => void;
};

function VirtualizedListInner<StoreOption extends ListNavigatorSelectOption>({
  filteredItems,
  containerRef,
  headerHeight,
  currentItemId,
  onSelectItem,
  estimateElementSize = 52,
}: VirtualizedListProps<StoreOption>) {
  const id = useId();
  const initialItemsLength = useRef(filteredItems.length);

  const virtualizer = useVirtualizer({
    count: filteredItems.length ?? 0,
    getScrollElement: useCallback(() => containerRef, [containerRef]),
    estimateSize: useCallback(() => estimateElementSize, [estimateElementSize]),
    scrollPaddingStart: headerHeight,
    overscan: 8,
  });

  const isFirstRendered = initialItemsLength.current === filteredItems.length;

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
        autoFocus={isFirstRendered && item.id === currentItemId}
        // NOTE: for this use case we should use style instead of sx to avoid having performance issues
        style={{
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
    [currentItemId, isFirstRendered]
  );

  // NOTE: use requestAnimationFrame to remove timeout to get exact item
  // https://github.com/TanStack/virtual/issues/537#issuecomment-1494593300
  const scrollToIndex = useCallback(() => {
    const indexToScrollTo = filteredItems.findIndex(
      (item) => item.id === currentItemId
    );
    virtualizer.scrollToIndex(indexToScrollTo, { align: 'start' });
  }, [filteredItems, currentItemId]);

  useEffect(() => {
    requestAnimationFrame(scrollToIndex);
  }, [scrollToIndex]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <MenuList
      variant="selectedMenu"
      id={`${id}-menu`}
      aria-labelledby={id}
      style={{
        paddingBottom: `${virtualizer.getTotalSize()}px`,
        position: 'relative',
        pointerEvents: virtualizer.isScrolling ? 'none' : 'auto',
      }}
    >
      {virtualItems.map((virtualRow) =>
        renderItem(virtualRow, filteredItems[virtualRow.index])
      )}
    </MenuList>
  );
}

export const VirtualizedList = memo(VirtualizedListInner);
