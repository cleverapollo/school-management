import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { Card, Stack, CardHeader, Box, Typography } from '@mui/material';
import { PersonalInformation } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useContactPersonal } from '../../../api/contact';

export default function ContactProfilePersonalPage() {
  const { t } = useTranslation(['common', 'people']);
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data: contactData } = useContactPersonal(idNumber);

  const personalInformation =
    contactData?.personalInformation as PersonalInformation;

  const primaryPhoneNumber = personalInformation?.primaryPhoneNumber
    ? `(${personalInformation?.primaryPhoneNumber?.countryCode ?? ''}) ${
        personalInformation?.primaryPhoneNumber?.number ?? ''
      }`
    : '-';

  return (
    <Card
      sx={{
        minHeight: 80,
        display: { md: 'flex' },
      }}
    >
      <Stack
        direction="column"
        flex={1}
        sx={{
          pl: 3,
          pr: 2,
          pt: 2.25,
          pb: 1.25,
        }}
      >
        <CardHeader
          component="h3"
          title={t('people:about')}
          sx={{ p: 0, m: 0 }}
        />

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            my: 1.5,
          }}
        >
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:title')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              -
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:forename')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {contactData?.person?.firstName}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:surname')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {contactData?.person?.lastName}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:tyroId')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {contactData?.partyId}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:spokenLanguage')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {contactData?.nativeLanguage ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:requiresInterpreter')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {contactData?.requiresInterpreter ? 'Yes' : 'No'}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            my: 1.5,
          }}
        >
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:addressLine1')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryAddress?.line1 ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:addressLine2')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryAddress?.line2 ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:addressLine3')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryAddress?.line3 ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:city')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryAddress?.city ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:eircode')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryAddress?.postCode ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:country')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryAddress?.country ?? '-'}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            my: 1.5,
          }}
        >
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:primaryNumber')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {primaryPhoneNumber}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:additionalNumber')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              -
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">{t('people:email')}</Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {personalInformation?.primaryEmail?.email ?? '-'}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">
              {t('people:occupation')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 260,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
                textOverflow: 'ellipsis',
              }}
            >
              {contactData?.occupation ?? '-'}
            </Typography>
          </Box>
          <Box flex={1} />
          <Box flex={1} />
        </Stack>
      </Stack>
    </Card>
  );
}
