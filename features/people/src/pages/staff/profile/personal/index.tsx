import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNumber } from '@tyro/core';
import { UpsertStaffInput, usePermissions } from '@tyro/api';

import { useStaffPersonal } from '../../../../api/staff/personal';
import { ProfileAbout } from './about';
import { ProfileContact } from './contact';
import { ProfileEmergency } from './emergency';
import { ProfileEmployment } from './employment';
import { useUpsertStaff } from '../../../../api/staff/upsert-staff';

export default function StaffProfilePersonalPage() {
  const { id } = useParams();
  const staffId = useNumber(id);
  const { isStaffUserWithPermission } = usePermissions();
  const hasPermissionWritePersonalInformation = isStaffUserWithPermission(
    'ps:1:people:staff_write'
  );

  const { data: staffData } = useStaffPersonal({ partyIds: [staffId ?? 0] });
  const { mutate: upsertStaffMutation } = useUpsertStaff();

  const handleEdit = (
    { staffIre, ...updatedData }: UpsertStaffInput,
    onSuccess: () => void
  ) =>
    upsertStaffMutation(
      [
        {
          id: staffData?.partyId,
          titleId: staffData?.person?.title?.id,
          firstName: staffData?.person.firstName,
          lastName: staffData?.person.lastName,
          gender: staffData?.personalInformation?.gender,
          startDate: staffData?.startDate,
          endDate: staffData?.endDate,
          dateOfBirth: staffData?.personalInformation?.dateOfBirth,
          payrollNumber: staffData?.payrollNumber,
          availableForTeaching: staffData?.availableForTeaching,
          availableForSubstitution: staffData?.availableForSubstitution,
          availableForSupportClasses: staffData?.availableForSupportClasses,
          employmentCapacity: staffData?.employmentCapacity?.id,
          carRegistrationNumber: staffData?.carRegistrationNumber,
          makeAndModel: staffData?.makeAndModel,
          parking: staffData?.parking,
          jobSharing: staffData?.jobSharing,
          qualifications: staffData?.qualifications,
          emergencyContact: staffData?.emergencyContact,
          competencies: staffData?.competencies,
          displayCode: staffData?.displayCode,
          position: staffData?.position,
          noLongerStaff: staffData?.noLongerStaffMember,
          staffIre: {
            staffPost: staffData?.staffIre?.staffPost?.id,
            teacherCouncilNumber: staffData?.staffIre?.teacherCouncilNumber,
            pps: staffData?.personalInformation?.ire?.ppsNumber,
            ...staffIre,
          },
          ...updatedData,
        },
      ],
      {
        onSuccess,
      }
    );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProfileAbout
          staffData={staffData}
          editable={!!hasPermissionWritePersonalInformation}
          onSave={handleEdit}
        />
      </Grid>

      <Grid item xs={12} sm={6} container spacing={2}>
        <Grid item xs={12}>
          <ProfileContact
            staffData={staffData}
            editable={!!hasPermissionWritePersonalInformation}
            onSave={handleEdit}
          />
        </Grid>

        <Grid item xs={12}>
          <ProfileEmergency
            staffData={staffData}
            editable={!!hasPermissionWritePersonalInformation}
            onSave={handleEdit}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6}>
        <ProfileEmployment
          staffData={staffData}
          editable={!!hasPermissionWritePersonalInformation}
          onSave={handleEdit}
        />
      </Grid>
    </Grid>
  );
}
