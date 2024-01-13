import { useParams } from 'react-router-dom';
import { useNumber } from '@tyro/core';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import { useFees } from '../../api/fees';
import { FeeFormState } from '../../components/fees/form/types';
import { FeeContainer } from '../../components/fees/container';
import { FeeForm } from '../../components/fees/form';

export default function EditFeePage() {
  const { feeId } = useParams();
  const partyId = useNumber(feeId) ?? 0;
  const { t } = useTranslation(['common']);

  const { data: feesData } = useFees({ ids: [partyId] });
  const [currentFee] = feesData || [];

  const initialState = useMemo<Partial<FeeFormState>>(() => {
    if (!currentFee) return {};

    const {
      dueDate,
      individualDiscounts,
      assignedToParties,
      discounts,
      ...restData
    } = currentFee;

    return {
      ...restData,
      dueDate: dueDate ? dayjs(dueDate) : undefined,
      discounts:
        Array.isArray(discounts) && discounts.length > 0
          ? discounts[0]
          : undefined,
      students: assignedToParties?.map((party) => {
        switch (party.__typename) {
          case 'Student':
            return {
              ...party,
              ...party.person,
              caption: t('common:searchType.STUDENT'),
            };
          case 'SubjectGroup':
            return {
              ...party,
              firstName: party.name,
              caption: t('common:searchType.SUBJECT_GROUP'),
            };
          case 'GeneralGroup':
            return {
              ...party,
              firstName: party.name,
              caption: t('common:searchType.GENERAL_GROUP'),
            };
          case 'YearGroupEnrollment':
            return {
              ...party,
              firstName: party.name,
              caption: t('common:searchType.YEAR_GROUP_ENROLLMENT'),
            };
          case 'ProgrammeStageEnrollment':
            return {
              ...party,
              firstName: party.name,
            };
          default:
            return party;
        }
      }),
      individualDiscounts: individualDiscounts?.map(
        ({ discount, personPartyId }) => ({
          ...discount,
          partyId: personPartyId,
        })
      ),
    };
  }, [currentFee]);

  return (
    <FeeContainer mode="edit" feeName={currentFee?.name}>
      <FeeForm initialState={initialState} />
    </FeeContainer>
  );
}
