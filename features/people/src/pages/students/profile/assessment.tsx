import { useParams } from 'react-router-dom';

export default function StudentProfileAssessmentPage() {
  const { id } = useParams();

  return <div>Student Profile Assessment Page {id}</div>;
}
