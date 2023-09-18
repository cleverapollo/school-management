import { useParams } from 'react-router-dom';
import { useNumber } from '@tyro/core';
import { useMemo } from 'react';
import { CustomGroupForm } from '../../components/custom-group/form';
import { CustomGroupFormContainer } from '../../components/custom-group/form/container';
import { useCustomGroupDefinition } from '../../api/custom-group-definition';
import { CustomGroupFormState } from '../../components/custom-group/form/types';

export default function EditCustomGroupPage() {
  const { groupId } = useParams();
  const partyId = useNumber(groupId) ?? 0;

  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const initialState = useMemo<Partial<CustomGroupFormState>>(() => {
    if (!customGroupData) return {};

    const { id, name, organisers, staffStatic, studentsStatic } =
      customGroupData;

    return {
      id,
      name: name ?? '',
      organisers: organisers || [],
      staticStudents: (studentsStatic || []).map(({ person }) => person),
      staticStaff: staffStatic || [],
    };
  }, [customGroupData]);

  return (
    <CustomGroupFormContainer mode="edit">
      <CustomGroupForm initialState={initialState} />
    </CustomGroupFormContainer>
  );
}
