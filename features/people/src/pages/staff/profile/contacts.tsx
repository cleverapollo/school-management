import { useParams } from 'react-router-dom';

export default function StaffProfileContactsPage() {
  const { id } = useParams();

  return <div>Staff Profile Contacts Page {id}</div>;
}
