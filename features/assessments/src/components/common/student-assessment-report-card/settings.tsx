import { useContext, createContext, ReactNode, useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
import { UseMeasureRef } from 'react-use/lib/useMeasure';

export type StudentAssessmentReportCardSettingsProviderProps = {
  children: ReactNode;
  academicNamespaceId: number;
  studentPartyId: number;
  assessmentId: number;
  editableComments?: {
    principalComment?: boolean;
    yearHeadComment?: boolean;
    tutorComment?: boolean;
    houseMasterComment?: boolean;
  };
};

export type StudentAssessmentReportCardSettingsContextValue = {
  academicNamespaceId: number;
  studentPartyId: number;
  assessmentId: number;
  tableContainerRef: UseMeasureRef<HTMLDivElement>;
  tableCardWidth: number;
  isMobile: boolean;
  isMobileCommentsShowing: boolean;
  toggleIsMobileCommentsShowing: () => void;
  editableComments: StudentAssessmentReportCardSettingsProviderProps['editableComments'];
};

const StudentAssessmentReportCardSettingsContext = createContext<
  StudentAssessmentReportCardSettingsContextValue | undefined
>(undefined);

export function StudentAssessmentReportCardSettingsProvider({
  children,
  academicNamespaceId,
  studentPartyId,
  assessmentId,
  editableComments,
}: StudentAssessmentReportCardSettingsProviderProps) {
  const [tableContainerRef, { width }] = useMeasure<HTMLDivElement>();
  const [isMobileCommentsShowing, setIsMobileCommentsShowing] =
    useState<boolean>(false);

  const isMobile = !!width && width < 600;

  const value = useMemo(
    () => ({
      academicNamespaceId,
      studentPartyId,
      assessmentId,
      tableContainerRef,
      tableCardWidth: width,
      isMobile,
      isMobileCommentsShowing,
      toggleIsMobileCommentsShowing: () =>
        setIsMobileCommentsShowing(!isMobileCommentsShowing),
      editableComments,
    }),
    [
      academicNamespaceId,
      studentPartyId,
      assessmentId,
      tableContainerRef,
      width,
      isMobile,
      isMobileCommentsShowing,
      setIsMobileCommentsShowing,
      editableComments,
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
