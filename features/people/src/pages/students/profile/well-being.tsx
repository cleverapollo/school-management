import { useParams } from 'react-router-dom';

export default function StudentProfileWellBeingPage() {
  const { id } = useParams();

  return <div>Student Profile Well-being Page {id}</div>;
}
