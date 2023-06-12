import { useParams } from 'react-router-dom';
import { ProcessingDataPlaceholder } from '@tyro/core';

export default function StudentProfileAssessmentPage() {
  const { id } = useParams();

  return <ProcessingDataPlaceholder />;
}
