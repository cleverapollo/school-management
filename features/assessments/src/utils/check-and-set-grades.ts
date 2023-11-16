import { CellValueChangedEvent, ValueSetterParams } from '@tyro/core';
import set from 'lodash/set';
import { getCalculateGrade } from '../api/term-assessments/calculate-grade';
import { ReturnTypeFromUseAssessmentResults } from '../api/assessment-results';

function mimicCellValueChanged(
  params: ValueSetterParams<ReturnTypeFromUseAssessmentResults>,
  field: string,
  oldValue: unknown,
  newValue: unknown
) {
  const column = params.columnApi.getColumn(field);
  const event = {
    ...params,
    column,
    colDef: column?.getColDef(),
    oldValue,
    newValue,
    type: 'cellValueChanged',
  } as CellValueChangedEvent<ReturnTypeFromUseAssessmentResults>;
  params.api.dispatchEvent(event);
}

export async function checkAndSetGrades(
  academicNamespaceId: number,
  params: ValueSetterParams<ReturnTypeFromUseAssessmentResults>
) {
  const {
    studentStudyLevel,
    studentProgramme,
    result,
    gradeResult: oldGrade,
    targetResult,
    targetGradeResult: oldTargetGrade,
  } = params.data;
  let gradePromise = null;
  let targetGradePromise = null;

  if (studentStudyLevel && studentProgramme?.shortName) {
    if (result) {
      gradePromise = getCalculateGrade(academicNamespaceId, {
        studyLevel: studentStudyLevel,
        result,
        programmeShortName: studentProgramme.shortName,
      });
    }

    if (targetResult) {
      targetGradePromise = getCalculateGrade(academicNamespaceId, {
        studyLevel: studentStudyLevel,
        result: targetResult,
        programmeShortName: studentProgramme.shortName,
      });
    }
  }

  try {
    const [grade, targetGrade] = await Promise.all([
      gradePromise,
      targetGradePromise,
    ]);

    if (oldGrade !== grade?.assessment_calculateGrade.grade) {
      set(params.data, 'gradeResult', grade?.assessment_calculateGrade.grade);
      mimicCellValueChanged(
        params,
        'gradeResult',
        oldGrade,
        params.data.gradeResult
      );
    }

    if (oldTargetGrade !== targetGrade?.assessment_calculateGrade.grade) {
      set(
        params.data,
        'targetGradeResult',
        targetGrade?.assessment_calculateGrade.grade
      );
      mimicCellValueChanged(
        params,
        'targetGradeResult',
        oldTargetGrade,
        params.data.targetGradeResult
      );
    }

    params.api.applyTransaction({
      update: [params.data],
    });
  } catch (error) {
    console.warn(error);
  }
}
