import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';

import { useCustomGroupById } from '../../../api';
import { GroupAttendance } from '../../../components/common/group-attendance';

export default function CustomGroupAttendancePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: customGroupData } = useCustomGroupById(groupIdNumber);

  return (
    <GroupAttendance
      partyId={customGroupData?.partyId ?? 0}
      students={customGroupData?.students || []}
    />
  );
}
