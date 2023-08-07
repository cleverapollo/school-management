import { useContext, createContext, ReactNode } from 'react';
import { ReturnTypeOfUseBlockList } from '../api/blocks';
import { YearGroupsAutocompleteProps } from '../components/common/list-manager/year-groups-autocomplete';

export type ClassListSettingsContextValue = {
  showGender: boolean;
  setCurrentBlock: (
    data?: NonNullable<ReturnTypeOfUseBlockList>[number]
  ) => void;
  setCurrentYearGroup: (
    data?: NonNullable<YearGroupsAutocompleteProps>['value']
  ) => void;
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
