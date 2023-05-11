import { useParams } from 'react-router-dom';

export default function StaffProfileOverviewPage() {
    const { id } = useParams();

    return <div>Staff Profile Overview Page {id}</div>;
}
