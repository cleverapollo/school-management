import { SaveSubjectSet } from '@tyro/api';

export interface SubjectOptionsFormState {
  name: string;
  academicYearId: number;
  yearGroupEnrolmentPartyId: number;
  classGroups: number[];
  subjectSets: SaveSubjectSet[];
}
