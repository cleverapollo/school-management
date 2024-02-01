import { SaveSubjectSet } from '@tyro/api';
import { ReturnTypeFromUseYearGroupListsByFilter } from '@tyro/groups';

type SubjectSet = Omit<SaveSubjectSet, 'subjectIds' | 'poolIdx'> & {
  subjects: { id: number; name: string }[];
};

type Pools = {
  poolIdx: number;
  subjectSets: SubjectSet[];
};

export interface SubjectOptionsFormState {
  name: string;
  academicYearId: number;
  selectedStudentYearGroups: { partyId: number; name: string }[];
  yearGroupEnrolmentPartyId: number;
  classGroups: number[];
  pools: Pools[];
  selectedStudents: ReturnTypeFromUseYearGroupListsByFilter[number]['students'];
}
