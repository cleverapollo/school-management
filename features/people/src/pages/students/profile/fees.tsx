import { useParams } from 'react-router-dom';

export default function StudentProfileFeesPage() {
  const { id } = useParams();

  return <div>Student Profile Fees Page {id}</div>;
}
