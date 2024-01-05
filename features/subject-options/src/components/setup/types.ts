import { SaveSubjectSet } from '@tyro/api';
import { ReturnTypeFromUseYearGroupListsByFilter } from '@tyro/groups';

type SubjectSet = Omit<SaveSubjectSet, 'subjectIds'> & {
  subjects: { id: number; name: string }[];
};

export interface SubjectOptionsFormState {
  name: string;
  academicYearId: number;
  selectedStudentYearGroups: { partyId: number; name: string }[];
  yearGroupEnrolmentPartyId: number;
  classGroups: number[];
  subjectSets: SubjectSet[];
  selectedStudents: ReturnTypeFromUseYearGroupListsByFilter[number]['students'];
}
