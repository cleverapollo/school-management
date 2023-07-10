import { StudentContactType } from '@tyro/api';
import { ReturnTypeFromUseStudentsForSiblingSearch } from '../../../api/student/students-for-sibling-search';
import { ReturnTypeFromUseStudentPersonal } from '../../../api/student/personal';

export interface ManageSiblingModalProps {
  open: boolean;
  onClose: () => void;
  currentStudent: ReturnTypeFromUseStudentPersonal['person'];
  currentSiblings: NonNullable<ReturnTypeFromUseStudentPersonal['siblings']>;
}

export interface ManageSiblingFormValues {
  enrolledSiblings: ReturnTypeFromUseStudentsForSiblingSearch[];
  nonEnrolledSiblings: ManageSiblingModalProps['currentSiblings']['nonEnrolledSiblings'];
  newContacts: Record<number, StudentContactType>;
}
