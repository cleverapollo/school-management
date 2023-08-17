import { useNumber } from '@tyro/core';
import { SessionAttendanceRoleBook } from '@tyro/attendance';
import { useParams } from 'react-router-dom';

export default function ClassGroupAttendancePage() {
  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);

  return <SessionAttendanceRoleBook partyIds={[groupIdAsNumber ?? 0]} />;
}
