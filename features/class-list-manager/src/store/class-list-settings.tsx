import { useContext, createContext, ReactNode } from 'react';
import { ReturnTypeOfUseBlockList } from '../api/blocks';
import { YearGroupsAutocompleteProps } from '../components/common/list-manager/year-groups-autocomplete';

export type ClassListSettingsContextValue = {
  showGender: boolean;
  setSelectedBlock: (
    data: NonNullable<ReturnTypeOfUseBlockList>[number] | null
  ) => void;
  setSelectedYearGroup: (
    data: NonNullable<YearGroupsAutocompleteProps>['value'] | null
  ) => void;
  selectedYearGroup: YearGroupsAutocompleteProps['value'] | null;
  selectedBlock: NonNullable<ReturnTypeOfUseBlockList>[number] | null;
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
