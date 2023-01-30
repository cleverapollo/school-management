import { useParams } from 'react-router-dom';

export default function StudentProfileTimetablePage() {
  const { id } = useParams();

  return <div>Student Profile Timetable Page {id}</div>;
}
