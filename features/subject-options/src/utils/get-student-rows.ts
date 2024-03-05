import set from 'lodash/set';
import { ReturnTypeFromUseOptionsSetup } from '../api/options';
import { ReturnTypeFromUseOptionsSolutions } from '../api/options-solutions';

type OptionsAssignedValue =
  ReturnTypeFromUseOptionsSolutions['pools'][number]['subjectSets'][number]['studentChoices'][number]['subjectSetChoices'][number];

export type StudentRow = {
  student: NonNullable<ReturnTypeFromUseOptionsSetup['students']>[number];
  optionsAssigned: Map<string, OptionsAssignedValue>;
  hasPreferences: boolean;
  hasReservedSubject: boolean;
  missingOneSubject: boolean;
  subjectsAllocated: number;
  reservesUsed: number;
  totalNeededSubjects: number;
};

export const getStudentRows = (
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  optionsSolutions: ReturnTypeFromUseOptionsSolutions | undefined
): StudentRow[] => {
  const studentsOptionsAssigned = new Map<
    number,
    Map<string, OptionsAssignedValue>
  >();
  const additionalStudentMeta: Record<
    number,
    {
      subjectsAllocated: number;
      reservesUsed: number;
      hasReservedSubject?: boolean;
      missingOneSubject?: boolean;
    }
  > = {};

  const totalNeededSubjects =
    optionsSetup?.subjectSets.reduce(
      (acc, subjectSet) => acc + subjectSet.mustGet,
      0
    ) ?? 0;

  optionsSolutions?.pools?.forEach(({ poolIdx, subjectSets }) => {
    subjectSets.forEach(({ id, studentChoices, mustGet }) => {
      studentChoices.forEach(
        ({
          studentPartyId,
          subjectsAllocated,
          reservedUsed,
          subjectSetChoices,
        }) => {
          set(
            additionalStudentMeta,
            `${studentPartyId}.subjectsAllocated`,
            subjectsAllocated +
              (additionalStudentMeta[studentPartyId]?.subjectsAllocated ?? 0)
          );
          set(
            additionalStudentMeta,
            `${studentPartyId}.reservesUsed`,
            reservedUsed +
              (additionalStudentMeta[studentPartyId]?.reservesUsed ?? 0)
          );

          if (subjectsAllocated < mustGet) {
            set(
              additionalStudentMeta,
              `${studentPartyId}.missingOneSubject`,
              true
            );
          }

          if (reservedUsed > 0) {
            set(
              additionalStudentMeta,
              `${studentPartyId}.hasReservedSubject`,
              reservedUsed > 0
            );
          }
          const currentStudentsOptionsAssigned = subjectSetChoices.reduce<
            Map<string, OptionsAssignedValue>
          >((acc, choice) => {
            acc.set(`${poolIdx}-${id.idx}-${choice.choiceIdx}`, choice);
            return acc;
          }, new Map(studentsOptionsAssigned.get(studentPartyId) ?? []));

          studentsOptionsAssigned.set(
            studentPartyId,
            currentStudentsOptionsAssigned
          );
        }
      );
    });
  });

  return (optionsSetup?.students ?? []).map((student) => {
    const studentsMeta = additionalStudentMeta[student.partyId];
    const madeChoices = !!studentsMeta;
    return {
      student,
      hasPreferences:
        madeChoices &&
        !studentsMeta?.missingOneSubject &&
        !studentsMeta?.hasReservedSubject,
      hasReservedSubject: false,
      missingOneSubject: !madeChoices,
      totalNeededSubjects,
      optionsAssigned:
        studentsOptionsAssigned.get(student.partyId) ?? new Map(),
      ...studentsMeta,
    };
  });
};
