import { useParams } from 'react-router-dom';

export default function StudentProfileAenPage() {
  const { id } = useParams();

  return <div>Student Profile AEN Page {id}</div>;
}
