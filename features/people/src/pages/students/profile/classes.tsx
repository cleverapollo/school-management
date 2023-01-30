import { useParams } from 'react-router-dom';

export default function StudentProfileClassesPage() {
  const { id } = useParams();

  return <div>Student Profile Classes Page {id}</div>;
}
