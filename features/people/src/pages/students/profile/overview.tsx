import { useParams } from 'react-router-dom';

export default function StudentProfileOverviewPage() {
  const { id } = useParams();

  return <div>Student Profile Overview Page {id}</div>;
}
