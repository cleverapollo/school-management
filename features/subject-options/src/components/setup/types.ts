import { SaveSubjectSet } from '@tyro/api';
import { ReturnTypeFromUseYearGroupListsByFilter } from '@tyro/groups';

export interface SubjectOptionsFormState {
  name: string;
  academicYearId: number;
  selectedStudentYearGroups: { partyId: number; name: string }[];
  yearGroupEnrolmentPartyId: number;
  classGroups: number[];
  subjectSets: SaveSubjectSet[];
  selectedStudents: ReturnTypeFromUseYearGroupListsByFilter[number]['students'];
}
