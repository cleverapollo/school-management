import { ProcessingDataPlaceholder } from '@tyro/core';
import { useParams } from 'react-router-dom';

export default function ContactProfileAccessPage() {
  const { id } = useParams();

  return <ProcessingDataPlaceholder />;
}
