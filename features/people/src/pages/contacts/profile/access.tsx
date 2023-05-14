import { useParams } from 'react-router-dom';

export default function ContactProfileAccessPage() {
  const { id } = useParams();

  return <div>Contact Profile Access Page {id}</div>;
}
