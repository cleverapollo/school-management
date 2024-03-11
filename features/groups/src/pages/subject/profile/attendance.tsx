import { useNumber } from '@tyro/core';
import { useParams, useSearchParams } from 'react-router-dom';

import { useSubjectGroupById } from '../../../api';
import { GroupAttendance } from '../../../components/common/group-attendance';

export default function SubjectGroupProfileAttendancePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);
  const [searchParams] = useSearchParams();

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  return (
    <GroupAttendance
      groupName={subjectGroupData?.name}
      partyId={subjectGroupData?.partyId ?? 0}
      eventStartTime={searchParams.get('eventStartTime')}
      students={subjectGroupData?.students || []}
    />
  );
}
