import {
  Box,
  Card,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useNumber } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { UserGroupTwoIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import { joinAddress } from '../../../utils/join-address';
import { useStudentPersonal } from '../../../api/student/personal';

const getAboutDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<'people'[]>
) => {
  const { partyId, personalInformation } = data ?? {};
  return {
    [t('people:personal.about.preferredName')]:
      personalInformation?.preferredFirstName ?? '-',
    [t('people:personal.about.forename')]:
      personalInformation?.firstName ?? '-',
    [t('people:personal.about.surname')]: personalInformation?.lastName ?? '-',
    [t('people:personal.about.dateOfBirth')]: personalInformation?.dateOfBirth
      ? personalInformation?.dateOfBirth.format('DD/MM/YYYY')
      : '-',
    [t('people:personal.about.ppsNumber')]:
      personalInformation?.ire?.ppsNumber ?? '-',
    [t('people:personal.about.departmentId')]: '-',
    [t('people:personal.about.gender.title')]: personalInformation?.gender
      ? t(`people:personal.about.gender.${personalInformation?.gender}`)
      : '-',
    [t('people:personal.about.birthCertForename')]: '-',
    [t('people:personal.about.birthCertSurname')]: '-',
    [t('people:tyroId')]: partyId ?? '-',
    [t('people:personal.about.countryOfBirth')]:
      personalInformation?.ire?.countryOfBirth ?? '-',
    [t('people:personal.about.nationality')]:
      personalInformation?.nationality ?? '-',
    [t('people:personal.about.mothersMaidenName')]:
      personalInformation?.mothersMaidenName ?? '-',
    [t('people:personal.about.motherTongue')]: '-',
    [t('people:personal.about.ethnicityAndCulturalBackground')]: '-',
  };
};

const getEnrolmentDataWithLabels = (
  data: ReturnType<typeof useStudentPersonal>['data'],
  t: TFunction<('people' | 'common')[]>
) => {
  const i18nPrefix = 'people:personal.enrolmentHistory';
  return {
    [t('common:academicYear')]: '-',
    [t(`${i18nPrefix}.enrolmentDate`)]: '-',
    [t(`${i18nPrefix}.programme`)]: '-',
    [t(`${i18nPrefix}.programmeYear`)]: '-',
    [t(`${i18nPrefix}.classGroup`)]: '-',
    [t(`${i18nPrefix}.classTutor`)]: '-',
    [t(`${i18nPrefix}.yearHead`)]: '-',
    [t(`${i18nPrefix}.lockerNumber`)]: '-',
    [t(`${i18nPrefix}.examNumber`)]: '-',
    [t(`${i18nPrefix}.examEntrant`)]: '-',
    [t(`${i18nPrefix}.repeatOfYearIndicator`)]: '-',
    [t(`${i18nPrefix}.boarderIndicator`)]: '-',
    [t(`${i18nPrefix}.boarderDays`)]: '-',
    [t(`${i18nPrefix}.shortTermPupil`)]: '-',
    [t(`${i18nPrefix}.numberOfWeeks`)]: '-',
    [t(`${i18nPrefix}.pupilSource`)]: '-',
    [t(`${i18nPrefix}.repeatLeavingCertificateFeesPayable`)]: '-',
    [t(`${i18nPrefix}.previousSchoolName`)]: '-',
    [t(`${i18nPrefix}.previousSchoolType`)]: '-',
    [t(`${i18nPrefix}.previousSchoolRollNumber`)]: '-',
    [t(`${i18nPrefix}.leftEarly`)]: '-',
    [t(`${i18nPrefix}.dateOfLeaving`)]: '-',
  };
};

export default function StudentProfilePersonalPage() {
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { t } = useTranslation(['people', 'common']);
  const { data } = useStudentPersonal(idNumber);

  const aboutDataWithLabels = getAboutDataWithLabels(data ?? null, t);
  const enrolmentDataWithLabels = getEnrolmentDataWithLabels(data ?? null, t);

  const { primaryEmail, primaryPhoneNumber, primaryAddress } =
    data?.personalInformation ?? {};

  console.log({ data });

  return (
    <Stack my={3} spacing={3}>
      <Card variant="outlined">
        <CardHeader title={t('people:personal.about.title')} />
        <Box
          component="dl"
          sx={{
            p: 3,
            m: 0,
            display: 'grid',
            gridRowGap: '2rem',
            gridColumnGap: '4rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          }}
        >
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            px: 3,
            pb: 3,
          }}
        >
          <UserGroupTwoIcon sx={{ color: 'slate.500', mr: 1 }} />
          <Typography variant="body1" sx={{ color: 'slate.600' }}>
            {t('common:siblings')}
          </Typography>
          <Chip
            label={t('common:noSiblingsRegisteredAtThisSchool')}
            sx={{ ml: 1.5 }}
          />
        </Box>
      </Card>
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader title="Student's contact details" />
          <Box
            component="dl"
            sx={{
              p: 3,
              m: 0,
              display: 'grid',
              gridRowGap: '2rem',
              gridColumnGap: '4rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            }}
          >
            <Box>
              <Typography component="dt" variant="subtitle1">
                {t('common:address')}
              </Typography>
              <Typography component="dd" variant="body1">
                {joinAddress(primaryAddress, { separator: <br /> })}
              </Typography>
            </Box>
            <Box>
              <Typography component="dt" variant="subtitle1">
                {t('common:phone')}
              </Typography>
              <Typography component="dd" variant="body1">
                {primaryPhoneNumber?.number ?? '-'}
              </Typography>
            </Box>
            <Box>
              <Typography component="dt" variant="subtitle1">
                {t('common:email')}
              </Typography>
              <Typography component="dd" variant="body1">
                {primaryEmail?.email ?? '-'}
              </Typography>
            </Box>
          </Box>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader title={t('people:personal.enrolmentHistory.title')} />
          <Box
            component="dl"
            sx={{
              p: 3,
              m: 0,
              display: 'grid',
              gridRowGap: '2rem',
              gridColumnGap: '4rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            }}
          >
            {Object.entries(enrolmentDataWithLabels).map(([label, value]) => (
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
      </Stack>
    </Stack>
  );
}
