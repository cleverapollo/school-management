import { useParams } from 'react-router-dom';

export default function StudentProfilePersonalPage() {
  const { id } = useParams();

  return <div>Student Profile Personal Page {id}</div>;
}
