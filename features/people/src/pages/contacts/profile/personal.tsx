import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, Box, Typography } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useContactPersonal } from '../../../api';

const getAboutDataWithLabels = (
  data: ReturnType<typeof useContactPersonal>['data'],
  t: TFunction<('common' | 'people')[]>
) => {
  const {
    partyId,
    personalInformation,
    nativeLanguage,
    requiresInterpreter,
    occupation,
  } = data ?? {};
  const { primaryPhoneNumber } = personalInformation || {};

  const primaryNumber = primaryPhoneNumber
    ? `(${primaryPhoneNumber?.countryCode ?? ''}) ${
        primaryPhoneNumber?.number ?? ''
      }`
    : '-';
  return {
    [t('people:title')]: '-',
    [t('people:personal.about.forename')]:
      personalInformation?.firstName ?? '-',
    [t('people:personal.about.surname')]: personalInformation?.lastName ?? '-',
    [t('people:tyroId')]: partyId ?? '-',
    [t('people:personal.about.spokenLanguage')]: nativeLanguage ?? '-',
    [t('people:personal.about.requiresInterpreter')]: requiresInterpreter
      ? 'Yes'
      : 'No',
    [t('people:personal.about.addressLine1')]:
      personalInformation?.primaryAddress?.line1 ?? '-',
    [t('people:personal.about.addressLine2')]:
      personalInformation?.primaryAddress?.line2 ?? '-',
    [t('people:personal.about.addressLine3')]:
      personalInformation?.primaryAddress?.line3 ?? '-',
    [t('people:personal.about.city')]:
      personalInformation?.primaryAddress?.city ?? '-',
    [t('people:personal.about.eircode')]:
      personalInformation?.primaryAddress?.postCode ?? '-',
    [t('people:personal.about.country')]:
      personalInformation?.primaryAddress?.country ?? '-',
    [t('people:personal.about.primaryNumber')]: primaryNumber ?? '-',
    [t('people:personal.about.additionalNumber')]: '-',
    [t('common:email')]: personalInformation?.primaryEmail?.email ?? '-',
    [t('people:personal.about.occupation')]: occupation ?? '-',
  };
};

export default function ContactProfilePersonalPage() {
  const { t } = useTranslation(['common', 'people']);
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data } = useContactPersonal(idNumber);

  const aboutDataWithLabels = getAboutDataWithLabels(data ?? null, t);

  return (
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
    </Card>
  );
}
