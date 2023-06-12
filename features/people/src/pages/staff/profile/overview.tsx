import { ProcessingDataPlaceholder } from '@tyro/core';
import { useParams } from 'react-router-dom';

export default function StaffProfileOverviewPage() {
  const { id } = useParams();

  return <ProcessingDataPlaceholder />;
}
