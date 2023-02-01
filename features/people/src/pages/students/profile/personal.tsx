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
import { MinusIcon, UserGroupTwoIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import { useStudentPersonal } from '../../../api/personal';

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

export default function StudentProfilePersonalPage() {
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { t } = useTranslation(['people', 'common']);
  const { data } = useStudentPersonal(idNumber);

  const aboutDataWithLabels = getAboutDataWithLabels(data ?? null, t);

  console.log({ data });

  return (
    <Stack my={3} spacing={3}>
      <Card variant="outlined">
        <CardHeader title={t('people:personal.about.title')} />
        <Box
          component="dl"
          sx={{
            p: 3,
            mb: 0,
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
          {/* <Grid component="dl" container spacing={2} sx={{ p: 3, mb: 0 }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography component="dt" variant="subtitle1">
                  {label}
                </Typography>
                <Typography component="dd" variant="body1">
                  {value}
                </Typography>
              </Grid>
          </Grid> */}
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader title="Enrolment history" />
        </Card>
      </Stack>
    </Stack>
  );
}
