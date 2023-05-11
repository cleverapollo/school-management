import { useParams } from 'react-router-dom';

export default function StaffProfilePersonalPage() {
  const { id } = useParams();

  return <div>Staff Profile Personal Page {id}</div>;
}
