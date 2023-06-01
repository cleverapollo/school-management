import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export type ShellContextValue = {
  isNavExpanded: boolean;
  setIsNavExpanded: Dispatch<SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextValue | undefined>(undefined);

type ShellProviderProps = {
  children: ReactNode;
};

function ShellProvider({ children }: ShellProviderProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const value = useMemo(
    () => ({
      isNavExpanded,
      setIsNavExpanded,
    }),
    [isNavExpanded, setIsNavExpanded]
  );
  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
}

function useShell() {
  const context = useContext(ShellContext);
  if (context === undefined) {
    throw new Error('useShell must be used within a ShellContext');
  }
  return context;
}

export { ShellContext, ShellProvider, useShell };
