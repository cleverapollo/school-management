import {
  CardHeader,
  Card,
  Box,
  Typography,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { TFunction, useTranslation } from '@tyro/i18n';
import { formatPhoneNumber, useNumber } from '@tyro/core';
import dayjs from 'dayjs';
import { getColorBasedOnIndex } from '@tyro/api';
import { useStaffPersonal } from '../../../api/staff/personal';

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
) => {
  const { person, personalInformation, carRegistrationNumber } = data || {};
  const { gender, dateOfBirth, ire, primaryAddress } =
    personalInformation || {};

  return {
    [t('people:title')]: person?.title || '-',
    [t('people:personal.about.forename')]: person?.firstName || '-',
    [t('people:personal.about.surname')]: person?.lastName || '-',
    [t('people:gender.title')]: gender ? t(`people:gender.${gender}`) : '-',
    [t('people:personal.about.dateOfBirth')]: dateOfBirth
      ? dayjs(dateOfBirth).format('DD/MM/YYYY')
      : '-',
    [t('people:ppsNumber')]: ire?.ppsNumber || '-',
    [t('people:personal.about.addressLine1')]: primaryAddress?.line1 || '-',
    [t('people:personal.about.addressLine2')]: primaryAddress?.line2 || '-',
    [t('people:personal.about.addressLine3')]: primaryAddress?.line3 || '-',
    [t('people:personal.about.city')]: primaryAddress?.city || '-',
    [t('people:personal.about.eircode')]: primaryAddress?.postCode || '-',
    [t('people:personal.about.country')]: primaryAddress?.country || '-',
    [t('people:carRegistration')]: carRegistrationNumber || '-',
  };
};

const getContactDataWithLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
) => {
  const {
    primaryPhoneNumber,
    phoneNumbers = [],
    primaryEmail,
    emails = [],
  } = data?.personalInformation || {};

  const additionalNumber = phoneNumbers?.find(
    (phoneNumber) => !phoneNumber?.primaryPhoneNumber
  );
  const additionalEmail = emails?.find((email) => !email?.primaryEmail);

  return {
    [t('people:personal.about.primaryNumber')]:
      formatPhoneNumber(primaryPhoneNumber),
    [t('people:personal.about.additionalNumber')]:
      formatPhoneNumber(additionalNumber),
    [t('people:personal.about.email')]: primaryEmail?.email || '-',
    [t('people:personal.about.additionalEmail')]: additionalEmail?.email || '-',
  };
};

const getEmergencyDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<'people'[]>
) => {
  const { nextOfKin } = data?.personalInformation || {};

  const { phoneNumbers, firstName, lastName } = nextOfKin || {};
  const [primaryNumber, additionalNumber] = phoneNumbers || [];

  return {
    [t('people:personal.about.forename')]: firstName || '-',
    [t('people:personal.about.surname')]: lastName || '-',
    [t('people:personal.about.primaryNumber')]: primaryNumber || '-',
    [t('people:personal.about.additionalNumber')]: additionalNumber || '-',
  };
};

const getEmploymentDataWitLabels = (
  data: ReturnType<typeof useStaffPersonal>['data'],
  t: TFunction<('people' | 'common')[]>
) => {
  const {
    payrollNumber,
    employmentCapacity,
    staffIreTeacher,
    startDate,
    endDate,
    // includeInTimetabling,
    subjectGroups = [],
    displayCode,
  } = data || {};

  const competencies = Array.from(
    new Map(
      subjectGroups
        .flatMap(({ subjects }) => subjects)
        .map((subject) => [subject.name, subject])
    ).values()
  );

  return {
    [t('people:position')]: staffIreTeacher?.teachingPost || '-',
    [t('people:capacity')]: employmentCapacity
      ? t(`people:employmentCapacity.${employmentCapacity}`)
      : '-',
    [t('people:payrollNumber')]: payrollNumber || '-',
    [t('people:displayCode')]: displayCode || '-',
    [t('people:teacherCouncilNumber')]:
      staffIreTeacher?.teacherCouncilNumber || '-',
    [t('people:jobSharing')]: '-',
    [t('people:dateOfEmployment')]: startDate
      ? `${dayjs(startDate).format('DD/MM/YYYY')} - ${
          endDate ? dayjs(endDate).format('DD/MM/YYYY') : t('people:present')
        }`
      : '-',
    [t('people:qualifications')]: '-',
    // [t('people:includeInTimetabling')]: includeInTimetabling
    //   ? t('common:yes')
    //   : t('common:no') ?? '-',
    [t('people:competencies')]:
      competencies.length > 0 ? (
        <Stack flexDirection="row" flexWrap="wrap" gap={0.5}>
          {competencies.map(({ name, colour }, index) => (
            <Chip
              key={name}
              color={colour ?? getColorBasedOnIndex(index)}
              label={name}
            />
          ))}
        </Stack>
      ) : (
        '-'
      ),
  };
};

const gridStyle = {
  p: 3,
  m: 0,
  display: 'grid',
  gridRowGap: '2rem',
  gridColumnGap: '4rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
};

export default function StaffProfilePersonalPage() {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const staffId = useNumber(id);

  const { data: staffData } = useStaffPersonal({ partyIds: [staffId ?? 0] });

  const aboutDataWithLabels = getAboutDataWithLabels(staffData, t);
  const contactDataWithLabels = getContactDataWithLabels(staffData, t);
  const emergencyDataWithLabels = getEmergencyDataWitLabels(staffData, t);
  const employmentDataWithLabels = getEmploymentDataWitLabels(staffData, t);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardHeader title={t('people:personal.about.title')} />
          <Box component="dl" sx={gridStyle}>
            {Object.entries(aboutDataWithLabels).map(([label, value]) => (
              <Box key={label}>
                <Typography component="dt" variant="subtitle1">
                  {label}
                </Typography>
                <Typography component="dd" variant="body1">
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} container spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title={t('common:contact')} />
            <Box component="dl" sx={gridStyle}>
              {Object.entries(contactDataWithLabels).map(([label, value]) => (
                <Box key={label}>
                  <Typography component="dt" variant="subtitle1">
                    {label}
                  </Typography>
                  <Typography component="dd" variant="body1">
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title={t('people:emergency')} />
            <Box component="dl" sx={gridStyle}>
              {Object.entries(emergencyDataWithLabels).map(([label, value]) => (
                <Box key={label}>
                  <Typography component="dt" variant="subtitle1">
                    {label}
                  </Typography>
                  <Typography component="dd" variant="body1">
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardHeader title={t('people:employment')} />
          <Box component="dl" sx={gridStyle}>
            {Object.entries(employmentDataWithLabels).map(([label, value]) => (
              <Box key={label}>
                <Typography component="dt" variant="subtitle1" mb={0.5}>
                  {label}
                </Typography>
                <Typography component="dd" variant="body1">
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
