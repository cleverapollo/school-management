import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';

import { useSubjectGroupById } from '../../../api';
import { GroupAttendance } from '../../../components/common/group-attendance';

export default function SubjectGroupProfileAttendancePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: supportGroupData } = useSubjectGroupById(groupIdNumber);

  return (
    <GroupAttendance
      partyId={supportGroupData?.partyId ?? 0}
      students={supportGroupData?.students || []}
    />
  );
}
