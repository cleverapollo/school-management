import { Options_SaveSubjectSet } from '@tyro/api';
import { ReturnTypeFromUseOptionsEnrollmentGroupsStudents } from '../../api/options-enrolment-groups';

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
  yearGroupId: number;
  classGroups: number[];
  pools: Pools[];
  selectedStudents: ReturnTypeFromUseOptionsEnrollmentGroupsStudents[];
}
