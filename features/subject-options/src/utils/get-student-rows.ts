import set from 'lodash/set';
import { ReturnTypeFromUseOptionsSetup } from '../api/options';
import { ReturnTypeFromUseOptionsSolutions } from '../api/options-solutions';

type OptionsAssignedValue =
  ReturnTypeFromUseOptionsSolutions['pools'][number]['subjectSets'][number]['studentChoices'][number]['subjectSetChoices'][number];

export type StudentRow = {
  student: NonNullable<ReturnTypeFromUseOptionsSetup['students']>[number];
  missedPreferences: number;
  optionsAssigned: Map<string, OptionsAssignedValue>;
  hasPreferences: boolean;
  hasReservedSubject: boolean;
  missingOneSubject: boolean;
};

export const getStudentRows = (
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  optionsSolutions: ReturnTypeFromUseOptionsSolutions | undefined
): StudentRow[] => {
  const studentsOptionsAssigned = new Map<
    number,
    Map<string, OptionsAssignedValue>
  >();
  const studentMissingPreferences = new Map<number, number>();
  const additionalStudentMeta: Record<
    number,
    {
      hasReservedSubject?: boolean;
      missingOneSubject?: boolean;
    }
  > = {};

  optionsSolutions?.pools?.forEach(({ poolIdx, subjectSets }) => {
    subjectSets.forEach(({ id, studentChoices, mustGet }) => {
      studentChoices.forEach(
        ({ studentPartyId, missed, subjectSetChoices }) => {
          studentMissingPreferences.set(
            studentPartyId,
            (studentMissingPreferences.get(studentPartyId) ?? 0) + missed
          );

          let numberOfAssignedSubjects = 0;
          const currentStudentsOptionsAssigned = subjectSetChoices.reduce<
            Map<string, OptionsAssignedValue>
          >((acc, choice) => {
            if (choice.choiceIdx >= mustGet) {
              set(
                additionalStudentMeta,
                `${studentPartyId}.hasReservedSubject`,
                true
              );
            }

            if (
              typeof choice.blockIdx === 'number' &&
              choice.subjectGroupName
            ) {
              numberOfAssignedSubjects += 1;
            }

            acc.set(`${poolIdx}-${id.idx}-${choice.choiceIdx}`, choice);
            return acc;
          }, new Map(studentsOptionsAssigned.get(studentPartyId) ?? []));

          if (numberOfAssignedSubjects < mustGet) {
            set(
              additionalStudentMeta,
              `${studentPartyId}.missingOneSubject`,
              true
            );
          }

          studentsOptionsAssigned.set(
            studentPartyId,
            currentStudentsOptionsAssigned
          );
        }
      );
    });
  });

  return (optionsSetup?.students ?? []).map((student) => ({
    student,
    missedPreferences: studentMissingPreferences.get(student.partyId) ?? 0,
    hasPreferences: studentMissingPreferences.get(student.partyId) === 0,
    hasReservedSubject: false,
    missingOneSubject: false,
    optionsAssigned: studentsOptionsAssigned.get(student.partyId) ?? new Map(),
    ...additionalStudentMeta[student.partyId],
  }));
};
