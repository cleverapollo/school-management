import { useParams } from 'react-router-dom';

export default function StudentProfileAttendancePage() {
  const { id } = useParams();

  return <div>Student Profile Attendance Page {id}</div>;
}
