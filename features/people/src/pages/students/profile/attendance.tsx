import { ProcessingDataPlaceholder } from '@tyro/core';
import { useParams } from 'react-router-dom';

import { MonthOverview } from '../../../components/students/attendance-calendar-view/index';

export default function StudentProfileAttendancePage() {
  const { id } = useParams();

  return <MonthOverview />;
}
