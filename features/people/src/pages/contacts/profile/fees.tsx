import { useParams } from 'react-router-dom';

export default function ContactProfileFeesPage() {
  const { id } = useParams();

  return <div>Contact Profile Fees Page {id}</div>;
}
