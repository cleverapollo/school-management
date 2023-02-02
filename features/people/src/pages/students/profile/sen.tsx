import { useParams } from 'react-router-dom';

export default function StudentProfileSenPage() {
  const { id } = useParams();

  return <div>Student Profile SEN Page {id}</div>;
}
