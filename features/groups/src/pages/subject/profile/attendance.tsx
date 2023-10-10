import { useNumber } from '@tyro/core';
import { useParams, useSearchParams } from 'react-router-dom';

import { useSubjectGroupById } from '../../../api';
import { GroupAttendance } from '../../../components/common/group-attendance';

export default function SubjectGroupProfileAttendancePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);
  const [searchParams] = useSearchParams();

  const { data: supportGroupData } = useSubjectGroupById(groupIdNumber);

  return (
    <GroupAttendance
      partyId={supportGroupData?.partyId ?? 0}
      eventStartTime={searchParams.get('eventStartTime')}
      students={supportGroupData?.students || []}
    />
  );
}
