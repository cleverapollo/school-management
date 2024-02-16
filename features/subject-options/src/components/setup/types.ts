import { Options_SaveSubjectSet } from '@tyro/api';
import { ReturnTypeFromUseYearGroupListsByFilter } from '@tyro/groups';

type SubjectSet = Omit<
  Options_SaveSubjectSet,
  'subjectIds' | 'poolIdx' | 'mustGet' | 'canChoose'
> & {
  subjects: { id: number; name: string }[];
  mustGet: number | null;
  canChoose: number | null;
};

type Pools = {
  poolIdx: number;
  subjectSets: SubjectSet[];
};

export interface SubjectOptionsFormState {
  name: string;
  academicYearId: number;
  selectedStudentYearGroups: { partyId: number; name: string }[];
  yearGroupId: number;
  classGroups: number[];
  pools: Pools[];
  selectedStudents: Pick<
    ReturnTypeFromUseYearGroupListsByFilter[number]['students'][number],
    'partyId' | 'person' | 'classGroup'
  >[];
}
