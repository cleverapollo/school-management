import { ReturnTypeOfUseBlockMembership } from '../../../../api/blocks';

type SubjectGroup =
  ReturnTypeOfUseBlockMembership['groups'][number]['subjectGroups'][number];

export interface ListManagerState {
  id: 'unassigned' | number;
  name: string;
  students:
    | ReturnTypeOfUseBlockMembership['groups'][number]['unenrolledStudents']
    | SubjectGroup['students'];
  staff?: SubjectGroup['staff'];
}
