import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchFocusContextValue {
  focusedOptionId: string | null;
  setFocusedOptionId: Dispatch<SetStateAction<string | null>>;
  navigateToSelectedOption: () => void;
  nextOption: () => void;
  previousOption: () => void;
  addOptionRef: (id: string, ref: HTMLLIElement) => void;
  removeOptionRef: (id: string) => void;
}

interface SearchFocusProps {
  children: ReactNode;
}

const SearchFocusContext = createContext<SearchFocusContextValue | undefined>(
  undefined
);

const optionRefs = new Map<string, HTMLLIElement>();

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
      ref.scrollIntoView({ block: 'nearest' });
    }
  }
}

export function SearchProvider({ children }: SearchFocusProps) {
  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const navigateToSelectedOption = useCallback(() => {
    if (focusedOptionId) {
      const ref = optionRefs.get(focusedOptionId);
      const url = ref ? ref.children[0].getAttribute('href') : null;

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

  const addOptionRef = useCallback((id: string, ref: HTMLLIElement) => {
    optionRefs.set(id, ref);
  }, []);

  const removeOptionRef = useCallback((id: string) => {
    optionRefs.delete(id);
  }, []);

  const value = useMemo(
    () => ({
      focusedOptionId,
      setFocusedOptionId,
      navigateToSelectedOption,
      nextOption,
      previousOption,
      addOptionRef,
      removeOptionRef,
    }),
    [
      focusedOptionId,
      setFocusedOptionId,
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
