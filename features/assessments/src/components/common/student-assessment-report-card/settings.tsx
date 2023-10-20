import { useContext, createContext, ReactNode, useMemo } from 'react';
import { useMeasure } from 'react-use';
import { UseMeasureRef } from 'react-use/lib/useMeasure';

export type StudentAssessmentReportCardSettingsContextValue = {
  tableContainerRef: UseMeasureRef<HTMLDivElement>;
  tableCardWidth: number;
  isMobile: boolean;
};

const StudentAssessmentReportCardSettingsContext = createContext<
  StudentAssessmentReportCardSettingsContextValue | undefined
>(undefined);

export function StudentAssessmentReportCardSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tableContainerRef, { width }] = useMeasure<HTMLDivElement>();

  const isMobile = width < 600;

  const value = useMemo(
    () => ({
      tableContainerRef,
      tableCardWidth: width,
      isMobile,
    }),
    [tableContainerRef, width, isMobile]
  );

  return (
    <StudentAssessmentReportCardSettingsContext.Provider value={value}>
      {children}
    </StudentAssessmentReportCardSettingsContext.Provider>
  );
}

export function useStudentAssessmentReportCardSettings() {
  const context = useContext(StudentAssessmentReportCardSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useStudentAssessmentReportCardSettings must be used within a StudentAssessmentReportCardSettingsProvider'
    );
  }
  return context;
}
