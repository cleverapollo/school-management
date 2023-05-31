import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNumber } from '@tyro/core';

import { useStaffPersonal } from '../../../../api/staff/personal';
import { ProfileAbout } from './about';
import { ProfileContact } from './contact';
import { ProfileEmergency } from './emergency';
import { ProfileEmployment } from './employment';

export default function StaffProfilePersonalPage() {
  const { id } = useParams();
  const staffId = useNumber(id);

  const { data: staffData } = useStaffPersonal({ partyIds: [staffId ?? 0] });

  // TODO: add permission to check if the user can edit the profile

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProfileAbout staffData={staffData} editable />
      </Grid>

      <Grid item xs={12} sm={6} container spacing={2}>
        <Grid item xs={12}>
          <ProfileContact staffData={staffData} editable />
        </Grid>

        <Grid item xs={12}>
          <ProfileEmergency staffData={staffData} editable />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6}>
        <ProfileEmployment staffData={staffData} editable />
      </Grid>
    </Grid>
  );
}
