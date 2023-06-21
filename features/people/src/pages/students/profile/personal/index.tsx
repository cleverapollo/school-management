import { Grid } from '@mui/material';
import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { UpdateStudentInput } from '@tyro/api';
import { useStudentPersonal } from '../../../../api/student/personal';
import { ProfileAbout } from './about';
import { ProfileEnrolment } from './enrolment';
import { ProfileContact } from './contact';
import { useUpdateStudent } from '../../../../api/student/update-student';
import { ProfileGuardianship } from './guardianship';

export default function StudentProfilePersonalPage() {
  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data: studentData } = useStudentPersonal(idNumber);
  const { mutate: updateStudentMutation } = useUpdateStudent();

  const handleEdit = (
    updatedData: Partial<UpdateStudentInput>,
    onSuccess: () => void
  ) =>
    updateStudentMutation(
      [
        {
          ...updatedData,
          studentPartyId: studentData?.partyId ?? 0,
        },
      ],
      { onSuccess }
    );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProfileAbout studentData={studentData} editable onSave={handleEdit} />
      </Grid>

      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} md={6} lg={7}>
          <ProfileContact
            studentData={studentData}
            editable
            onSave={handleEdit}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <ProfileGuardianship
            studentData={studentData}
            editable
            onSave={handleEdit}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <ProfileEnrolment
          studentData={studentData}
          editable
          onSave={handleEdit}
        />
      </Grid>
    </Grid>
  );
}
