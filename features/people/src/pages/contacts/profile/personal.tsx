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
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    ire,
    primaryAddress,
    primaryPhoneNumber,
    primaryEmail,
  } = personalInformation || {};

  const primaryNumber = primaryPhoneNumber
    ? `(${primaryPhoneNumber?.countryCode ?? ''}) ${
        primaryPhoneNumber?.number ?? ''
      }`
    : '-';

  const i18nPrefix = 'people:personal.about';

  return {
    [t('people:title')]: '-',
    [t(`${i18nPrefix}.forename`)]: firstName ?? '-',
    [t(`${i18nPrefix}.surname`)]: lastName ?? '-',
    [t(`${i18nPrefix}.dateOfBirth`)]: dateOfBirth
      ? dateOfBirth.format('DD/MM/YYYY')
      : '-',
    [t('people:tyroId')]: partyId ?? '-',
    [t('people:gender.title')]: gender ? t(`people:gender.${gender}`) : '-',
    [t(`${i18nPrefix}.countryOfBirth`)]: ire?.countryOfBirth ?? '-',
    [t(`${i18nPrefix}.spokenLanguage`)]: nativeLanguage ?? '-',
    [t(`${i18nPrefix}.requiresInterpreter`)]: requiresInterpreter
      ? t('common:yes')
      : t('common:no'),
    [t(`${i18nPrefix}.addressLine1`)]: primaryAddress?.line1 ?? '-',
    [t(`${i18nPrefix}.addressLine2`)]: primaryAddress?.line2 ?? '-',
    [t(`${i18nPrefix}.addressLine3`)]: primaryAddress?.line3 ?? '-',
    [t(`${i18nPrefix}.city`)]: primaryAddress?.city ?? '-',
    [t(`${i18nPrefix}.eircode`)]: primaryAddress?.postCode ?? '-',
    [t(`${i18nPrefix}.country`)]: primaryAddress?.country ?? '-',
    [t(`${i18nPrefix}.primaryNumber`)]: primaryNumber ?? '-',
    [t(`${i18nPrefix}.additionalNumber`)]: '-',
    [t('common:email')]: primaryEmail?.email ?? '-',
    [t(`${i18nPrefix}.occupation`)]: occupation ?? '-',
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
