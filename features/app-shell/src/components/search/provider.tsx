import { SearchMeta, SearchType } from '@tyro/api';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchOptionMeta extends SearchMeta {
  path?: string;
  breadcrumbs?: string[];
}

export interface SearchOptionData {
  partyId: string | number;
  type: 'PAGE' | SearchType;
  text: string;
  meta: SearchOptionMeta;
}

interface SearchFocusContextValue {
  focusedOptionId: string | null;
  setFocusedOptionId: Dispatch<SetStateAction<string | null>>;
  recentSearchs: SearchOptionData[];
  removeRecentSearch: (id: string | number) => void;
  navigateToSelectedOption: () => void;
  nextOption: () => void;
  previousOption: () => void;
  addOptionRef: (
    id: string,
    ref: { node: HTMLLIElement; data: SearchOptionData }
  ) => void;
  removeOptionRef: (id: string) => void;
}

interface SearchFocusProps {
  children: ReactNode;
  data: any;
}

const SearchFocusContext = createContext<SearchFocusContextValue | undefined>(
  undefined
);

const optionRefs = new Map<
  string,
  { node: HTMLLIElement; data: SearchOptionData }
>();

function getNthFromOption(id: string | null, diff: number) {
  const keys = Array.from(optionRefs.keys());

  const index = id ? keys.indexOf(id) : -1;
  const nextIndex = index + diff;

  const newKey = keys[nextIndex];

  if (index >= 0 && newKey) {
    return newKey;
  }
  if (diff > 0) {
    return keys[0];
  }
  return keys[keys.length - 1];
}

function focusToOption(id: string | null) {
  if (id) {
    const ref = optionRefs.get(id);
    if (ref) {
      ref.node.scrollIntoView({ block: 'nearest' });
    }
  }
}

export function SearchProvider({ children, data }: SearchFocusProps) {
  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null);
  const [recentSearchs, setRecentSearchs] = useState<SearchOptionData[]>([]);
  const navigate = useNavigate();

  const addSearchToRecentSearch = useCallback(
    (id: number | string, optionData: SearchOptionData) => {
      setRecentSearchs((searchs) => {
        const searchIndex = searchs.findIndex((item) => item.partyId === id);
        if (searchIndex !== -1) {
          searchs.splice(searchIndex, 1);
        } else if (searchs.length >= 5) {
          searchs.pop();
        }
        searchs.unshift(optionData);

        localStorage.setItem('tyro-recent-search', JSON.stringify(searchs));
        return [...searchs];
      });
    },
    [setRecentSearchs]
  );

  const removeRecentSearch = useCallback(
    (id: number | string) => {
      setRecentSearchs((searchs) => {
        const searchIndex = searchs.findIndex((item) => item.partyId === id);
        if (searchIndex !== -1) {
          searchs.splice(searchIndex, 1);
        }

        localStorage.setItem('tyro-recent-search', JSON.stringify(searchs));
        return [...searchs];
      });
    },
    [setRecentSearchs]
  );

  const navigateToSelectedOption = useCallback(() => {
    if (focusedOptionId) {
      const ref = optionRefs.get(focusedOptionId);
      const url = ref?.node ? ref.node.children[0].getAttribute('href') : null;

      if (ref?.data) {
        // Need to move logic to backend rather than localstorage
        // addSearchToRecentSearch(ref.data.partyId, ref?.data);
      }

      if (url) {
        navigate(url);
      }
    }
  }, [focusedOptionId, navigate]);

  const nextOption = useCallback(() => {
    setFocusedOptionId((id) => {
      if (optionRefs.size > 0) {
        const nextKey = getNthFromOption(id, 1);

        focusToOption(nextKey);
        return nextKey;
      }

      return null;
    });
  }, [setFocusedOptionId]);

  const previousOption = useCallback(() => {
    setFocusedOptionId((id) => {
      if (optionRefs.size > 0) {
        const previousKey = getNthFromOption(id, -1);

        focusToOption(previousKey);
        return previousKey;
      }

      return null;
    });
  }, [setFocusedOptionId]);

  const addOptionRef = useCallback(
    (id: string, ref: { node: HTMLLIElement; data: SearchOptionData }) => {
      optionRefs.set(id, ref);
    },
    []
  );

  const removeOptionRef = useCallback((id: string) => {
    optionRefs.delete(id);
  }, []);

  useEffect(() => {
    if (data) {
      setFocusedOptionId(null);
    }
  }, [data, setFocusedOptionId]);

  useEffect(() => {
    const recentSearchsFromLocalStorage =
      localStorage.getItem('tyro-recent-search');
    if (recentSearchsFromLocalStorage) {
      const parsedRecentSearchs = JSON.parse(
        recentSearchsFromLocalStorage
      ) as SearchOptionData[];
      setRecentSearchs(parsedRecentSearchs);
    }
  }, []);

  const value = useMemo(
    () => ({
      focusedOptionId,
      setFocusedOptionId,
      recentSearchs,
      removeRecentSearch,
      navigateToSelectedOption,
      nextOption,
      previousOption,
      addOptionRef,
      removeOptionRef,
    }),
    [
      focusedOptionId,
      setFocusedOptionId,
      recentSearchs,
      removeRecentSearch,
      navigateToSelectedOption,
      nextOption,
      previousOption,
      addOptionRef,
      removeOptionRef,
    ]
  );

  return (
    <SearchFocusContext.Provider value={value}>
      {children}
    </SearchFocusContext.Provider>
  );
}

export function useSearchProvider() {
  const context = useContext(SearchFocusContext);
  if (context === undefined) {
    throw new Error('useSearchProvider must be used within a SearchProvider');
  }
  return context;
}
