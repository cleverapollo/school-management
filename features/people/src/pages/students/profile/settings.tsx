import { useParams } from 'react-router-dom';

export default function StudentProfileSettingsPage() {
  const { id } = useParams();

  return <div>Student Profile Settings Page {id}</div>;
}
