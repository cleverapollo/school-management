import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from '@tyro/calendar';
import { useNumber } from '@tyro/core';
import { SearchType } from '@tyro/api';
import { useCustomGroupById } from '../../../api';

export default function CustomGroupTimetablePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: customGroupData } = useCustomGroupById(groupIdNumber);

  const defaultPartys = useMemo(
    () =>
      customGroupData?.partyId
        ? [
            {
              partyId: customGroupData?.partyId,
              text: customGroupData?.name,
              type: SearchType.CustomGroup,
              avatarUrl: customGroupData?.avatarUrl,
            },
          ]
        : [],
    [customGroupData]
  );

  return <Calendar defaultPartys={defaultPartys} editable />;
}
