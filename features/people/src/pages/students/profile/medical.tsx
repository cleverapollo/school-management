import { useParams } from 'react-router-dom';
import { getNumber, useBreakpointValue } from '@tyro/core';
import { Stack } from '@mui/material';
import { SiblingsWidget } from '../../../components/students/medical/siblings-widget';
import { StudentMedicalProfessionalWidget } from '../../../components/students/medical/student-medical-professional-widget';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';
import { ConditionsTable } from '../../../components/students/medical/conditions-table';

export default function StudentProfileMedicalPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const direction = useBreakpointValue<'row' | 'column'>({
    base: 'column',
    md: 'row',
  });

  return (
    <>
      <ConditionsTable studentId={studentId} />

      <Stack direction={direction} spacing={3}>
        <StudentContactsWidget studentId={studentId} />
        <StudentMedicalProfessionalWidget studentId={studentId} />
        <SiblingsWidget studentId={studentId} />
      </Stack>
    </>
  );
}
