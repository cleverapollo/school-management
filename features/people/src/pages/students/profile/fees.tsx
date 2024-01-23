import { useParams } from 'react-router-dom';
import { StudentFeesTable } from '@tyro/fees';
import { getNumber } from '@tyro/core';

export default function StudentProfileFeesPage() {
  const { id } = useParams();
  const studentId = getNumber(id);

  return <StudentFeesTable filter={{ studentPartyId: studentId }} />;
}
