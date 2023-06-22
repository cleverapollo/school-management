import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from '@tyro/calendar';
import { useNumber } from '@tyro/core';
import { SearchType } from '@tyro/api';
import { useClassGroupById } from '../../api/class-groups';

export default function ClassGroupProfileTimetablePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: classGroupData } = useClassGroupById(groupIdNumber);

  const defaultPartys = useMemo(
    () =>
      classGroupData?.name && groupIdNumber
        ? [
            {
              partyId: groupIdNumber,
              text: classGroupData?.name,
              type: SearchType.SubjectGroup,
            },
          ]
        : [],
    [classGroupData]
  );

  return <Calendar defaultPartys={defaultPartys} />;
}
