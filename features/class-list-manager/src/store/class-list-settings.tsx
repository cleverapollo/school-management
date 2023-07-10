import { useContext, createContext, ReactNode } from 'react';

export type ClassListSettingsContextValue = {
  showGender: boolean;
};

const ClassListSettingsContext = createContext<
  ClassListSettingsContextValue | undefined
>(undefined);

export function ClassListSettingsProvider({
  children,
  ...value
}: ClassListSettingsContextValue & { children: ReactNode }) {
  return (
    <ClassListSettingsContext.Provider value={value}>
      {children}
    </ClassListSettingsContext.Provider>
  );
}

export function useClassListSettings() {
  const context = useContext(ClassListSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useClassListSettings must be used within a ClassListSettingsContext'
    );
  }
  return context;
}
