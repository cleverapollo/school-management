import { getNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import {
  ReturnTypeFromUseOptionsSetup,
  useOptionsSetup,
} from '../../api/options';
import {
  ReturnTypeFromUseOptionsPreferences,
  useOptionsPreferences,
} from '../../api/options-preferences';
import { OptionsMatrixTable } from '../../components/view/stats/matrix-table';

export default function StudentOptionsStatsPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;

  const { data: optionsSetup } = useOptionsSetup(optionId);
  const { data: preferences } = useOptionsPreferences({ optionId });

  return (
    <OptionsMatrixTable
      optionsSetup={optionsSetup}
      studentChoices={preferences ?? []}
    />
  );
}
