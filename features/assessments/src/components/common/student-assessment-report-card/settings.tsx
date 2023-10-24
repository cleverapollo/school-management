import { useContext, createContext, ReactNode, useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
import { UseMeasureRef } from 'react-use/lib/useMeasure';

export type StudentAssessmentReportCardSettingsContextValue = {
  tableContainerRef: UseMeasureRef<HTMLDivElement>;
  tableCardWidth: number;
  isMobile: boolean;
  isMobileCommentsShowing: boolean;
  toggleIsMobileCommentsShowing: () => void;
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
  const [isMobileCommentsShowing, setIsMobileCommentsShowing] =
    useState<boolean>(false);

  const isMobile = !!width && width < 600;

  const value = useMemo(
    () => ({
      tableContainerRef,
      tableCardWidth: width,
      isMobile,
      isMobileCommentsShowing,
      toggleIsMobileCommentsShowing: () =>
        setIsMobileCommentsShowing(!isMobileCommentsShowing),
    }),
    [
      tableContainerRef,
      width,
      isMobile,
      isMobileCommentsShowing,
      setIsMobileCommentsShowing,
    ]
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
