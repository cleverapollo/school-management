import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from '@tyro/calendar';
import { useNumber } from '@tyro/core';
import { SearchType } from '@tyro/api';
import { useSubjectGroupById } from '../../../api';

export default function SubjectGroupProfileTimetablePage() {
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const defaultPartys = useMemo(
    () =>
      subjectGroupData?.partyId
        ? [
            {
              partyId: subjectGroupData.partyId,
              text: subjectGroupData.name,
              type: SearchType.SubjectGroup,
              avatarUrl: subjectGroupData.avatarUrl,
            },
          ]
        : [],
    [subjectGroupData]
  );

  return <Calendar defaultPartys={defaultPartys} />;
}
