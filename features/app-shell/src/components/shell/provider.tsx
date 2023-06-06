import { ReactNode, createContext, useContext, useMemo } from 'react';
import { useDisclosure } from '@tyro/core';

export type AppShellConfigContextValue = {
  isNavExpanded: boolean;
  onNavExpand: () => void;
  onNavCollapse: () => void;
};

const AppShellConfigContext = createContext<
  AppShellConfigContextValue | undefined
>(undefined);

type AppShellConfigProviderProps = {
  children: ReactNode;
};

function AppShellConfigProvider({ children }: AppShellConfigProviderProps) {
  const {
    isOpen: isNavExpanded,
    onOpen: onNavExpand,
    onClose: onNavCollapse,
  } = useDisclosure({ defaultIsOpen: true });

  const value = useMemo(
    () => ({
      isNavExpanded,
      onNavExpand,
      onNavCollapse,
    }),
    [isNavExpanded, onNavCollapse]
  );
  return (
    <AppShellConfigContext.Provider value={value}>
      {children}
    </AppShellConfigContext.Provider>
  );
}

function useAppShellConfig() {
  const context = useContext(AppShellConfigContext);
  if (context === undefined) {
    throw new Error(
      'useAppShellConfig must be used within a AppShellConfigContext'
    );
  }
  return context;
}

export { AppShellConfigContext, AppShellConfigProvider, useAppShellConfig };
