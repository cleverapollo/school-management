import { useParams } from 'react-router-dom';

export default function Overview() {
  const { id } = useParams();

  return <div>Attendance Page Overview {id}</div>;
}
