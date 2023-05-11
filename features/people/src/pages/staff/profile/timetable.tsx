import { useParams } from 'react-router-dom';

export default function StaffProfileTimetablePage() {
  const { id } = useParams();

  return <div>Staff Profile Timetable Page {id}</div>;
}
