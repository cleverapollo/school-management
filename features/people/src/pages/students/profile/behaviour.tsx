import { useParams } from 'react-router-dom';

export default function StudentProfileBehaviourPage() {
  const { id } = useParams();

  return <div>Student Profile Behaviour Page {id}</div>;
}
