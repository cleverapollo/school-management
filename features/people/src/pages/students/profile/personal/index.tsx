import { Grid } from '@mui/material';
import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useStudentPersonal } from '../../../../api/student/personal';
import { ProfileAbout } from './about';
import { ProfileEnrolment } from './enrolment';
import { ProfileContact } from './contact';

export default function StudentProfilePersonalPage() {
  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data } = useStudentPersonal(idNumber);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProfileAbout studentData={data} editable />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProfileContact studentData={data} editable />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProfileEnrolment studentData={data} editable />
      </Grid>
    </Grid>
  );
}
