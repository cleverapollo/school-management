import {
  useCallback,
  useState,
  useContext,
  createContext,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
  Context,
} from 'react';

export type SelectionListContextValue<T extends object | string> = {
  performCardAction: (
    event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    cardIds: string[]
  ) => void;
  checkedCardIds: Set<string>;
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  unselectedSearch: string;
  selectedSearch: string;
  setUnselectedSearch: Dispatch<SetStateAction<string>>;
  setSelectedSearch: Dispatch<SetStateAction<string>>;
  getOptionLabel: (option: T) => string;
  getOptionId: (option: T) => string;
  unselectedOptions: T[];
  selectedOptions: T[];
  showSearch?: boolean;
  optionsCheckToMoveToSelected: T[];
  optionsCheckToMoveToUnselected: T[];
  moveToSelected: () => void;
  moveToUnselected: () => void;
  collapsibleGroups?: boolean;
  expandedGroups: Set<string>;
  toggleGroupExpansion: (group: string) => void;
};

const SelectionListContext = createContext<
  SelectionListContextValue<object | string> | undefined
>(undefined);

type SelectionListProviderProps<T extends object | string> = {
  value: T[];
  onChange: (value: T[]) => void;
  options: T[];
  optionIdKey?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  optionTextKey?: T extends object ? keyof T : never;
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  collapsibleGroups?: boolean;
  getOptionLabel?: (option: T) => string;
  showSearch?: boolean;
  children: ReactNode | ((value: SelectionListContextValue<T>) => ReactNode);
};

export function SelectionListProvider<T extends string | object>({
  children,
  options,
  optionIdKey,
  optionTextKey,
  groupBy,
  collapsibleGroups = false,
  getOptionLabel: externalGetOptionLabel,
  showSearch,
  value,
  onChange,
}: SelectionListProviderProps<T>) {
  const SelectionListContextRef = SelectionListContext as Context<
    SelectionListContextValue<T> | undefined
  >;
  const [unselectedSearch, setUnselectedSearch] = useState<string>('');
  const [selectedSearch, setSelectedSearch] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set<string>()
  );

  const [checkedCardIds, setCheckedCardIds] = useState<Set<string>>(
    new Set<string>()
  );

  const unselectAll = () => {
    setCheckedCardIds(new Set<string>());
  };

  const getOptionId = useCallback(
    (option: T) => {
      if (typeof optionIdKey === 'function') {
        const optionIdKeyFunction = optionIdKey as (option: T) => string;
        return optionIdKeyFunction(option);
      }

      if (typeof optionIdKey === 'string') {
        return JSON.stringify(option[optionIdKey]);
      }

      if (
        process.env.NODE_ENV === 'development' &&
        typeof option === 'object'
      ) {
        console.warn(
          'You must provide optionIdKey when using object as option type'
        );
      }

      return JSON.stringify(option) as unknown as string;
    },
    [optionIdKey]
  );

  const { unselectedOptions, selectedOptions } = useMemo(() => {
    const valueIds = value.map((option) => getOptionId(option));

    return {
      unselectedOptions: options.filter((option) => {
        const optionId = getOptionId(option);
        return !valueIds.includes(optionId);
      }),
      selectedOptions: value,
    };
  }, [value, options, optionIdKey, getOptionId]);
  const optionsCheckToMoveToSelected = useMemo(
    () =>
      unselectedOptions.filter((option) => {
        const optionId = getOptionId(option);
        return checkedCardIds.has(optionId);
      }),
    [checkedCardIds]
  );
  const optionsCheckToMoveToUnselected = useMemo(
    () =>
      selectedOptions.filter((option) => {
        const optionId = getOptionId(option);
        return checkedCardIds.has(optionId);
      }),
    [checkedCardIds]
  );

  const getOptionLabel = useCallback(
    (option: T) => {
      if (optionTextKey) {
        return option[optionTextKey] as unknown as string;
      }

      if (externalGetOptionLabel) {
        return externalGetOptionLabel(option);
      }

      if (
        process.env.NODE_ENV === 'development' &&
        typeof option === 'object'
      ) {
        console.warn(
          'You must provide either optionTextKey or getOptionLabel when using object as option type'
        );
      }

      return option as unknown as string;
    },
    [optionTextKey, externalGetOptionLabel]
  );

  const moveToSelected = useCallback(() => {
    const valueIds = value.map((option) => getOptionId(option));
    const newValueIds = new Set([...valueIds, ...checkedCardIds]);
    const optionsMap = new Map(
      [...options, ...value].map((option) => [getOptionId(option), option])
    );
    const newValue = Array.from(newValueIds)
      .map((id) => optionsMap.get(id))
      .filter(Boolean) as T[];

    onChange(newValue);
    unselectAll();
  }, [value, checkedCardIds, getOptionId, onChange]);

  const moveToUnselected = useCallback(() => {
    const newValue = value.filter(
      (option) => !checkedCardIds.has(getOptionId(option))
    );
    onChange(newValue);
    unselectAll();
  }, [value, checkedCardIds, getOptionId, onChange]);

  const performCardAction = (
    event: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    cardIds: string[]
  ) => {
    setCheckedCardIds((previousCheckedCardIds) => {
      if (cardIds.every((cardId) => previousCheckedCardIds.has(cardId))) {
        cardIds.forEach((cardId) => previousCheckedCardIds.delete(cardId));
      } else {
        cardIds.forEach((cardId) => previousCheckedCardIds.add(cardId));
      }
      return new Set(previousCheckedCardIds);
    });
  };

  const toggleGroupExpansion = useCallback(
    (group: string) => {
      setExpandedGroups((previousExpandedGroups) => {
        if (previousExpandedGroups.has(group)) {
          previousExpandedGroups.delete(group);
        } else {
          previousExpandedGroups.add(group);
        }
        return new Set(previousExpandedGroups);
      });
    },
    [setExpandedGroups]
  );

  const providerValue = useMemo(
    () => ({
      performCardAction,
      checkedCardIds,
      unselectedSearch,
      selectedSearch,
      setUnselectedSearch,
      setSelectedSearch,
      groupBy,
      showSearch,
      unselectedOptions,
      selectedOptions,
      getOptionLabel,
      getOptionId,
      optionsCheckToMoveToSelected,
      optionsCheckToMoveToUnselected,
      moveToSelected,
      moveToUnselected,
      collapsibleGroups,
      expandedGroups,
      toggleGroupExpansion,
    }),
    [
      performCardAction,
      checkedCardIds,
      unselectedSearch,
      selectedSearch,
      setUnselectedSearch,
      setSelectedSearch,
      groupBy,
      showSearch,
      unselectedOptions,
      selectedOptions,
      getOptionLabel,
      getOptionId,
      optionsCheckToMoveToSelected,
      optionsCheckToMoveToUnselected,
      moveToSelected,
      moveToUnselected,
      collapsibleGroups,
      expandedGroups,
      toggleGroupExpansion,
    ]
  );

  return (
    <SelectionListContextRef.Provider value={providerValue}>
      {typeof children === 'function' ? children(providerValue) : children}
    </SelectionListContextRef.Provider>
  );
}

export function useSelectionListState<T extends object | string>() {
  const context = useContext(
    SelectionListContext as Context<SelectionListContextValue<T> | undefined>
  );
  if (context === undefined) {
    throw new Error(
      'useSelectionListState must be used within a SelectionListContext'
    );
  }
  return context;
}
