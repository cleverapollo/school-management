import { useParams } from 'react-router-dom';

export default function StaffProfileClassesPage() {
  const { id } = useParams();

  return <div>Staff Profile Classes Page {id}</div>;
}
