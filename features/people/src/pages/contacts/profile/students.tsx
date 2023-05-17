import { useParams } from 'react-router-dom';

export default function ContactProfileStudentsPage() {
  const { id } = useParams();

  return <div>Contact Profile Students Page {id}</div>;
}
