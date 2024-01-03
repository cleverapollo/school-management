import { Box, Card, CardHeader, Stack, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useSchoolsInfo } from '../../api/ppod/school-details';

const getSchoolDetailsWithLabels = (
  schoolDetails: ReturnType<typeof useSchoolsInfo>['data'],
  t: TFunction<'settings'[]>
) => ({
  [t('settings:schoolDetails.name')]: schoolDetails?.name ?? '-',
  [t('settings:schoolDetails.rollNo')]: schoolDetails?.rollNo ?? '-',
  [t('settings:schoolDetails.phone')]:
    (schoolDetails?.phones &&
      schoolDetails?.phones.map((phone) => phone?.phone).join(', ')) ??
    '-',
  [t('settings:schoolDetails.email')]: schoolDetails?.email ?? '-',
  [t('settings:schoolDetails.website')]: schoolDetails?.website ?? '-',
  [t('settings:schoolDetails.parentAssociation')]:
    schoolDetails?.parentAssociation ?? '-',
  [t('settings:schoolDetails.studentCouncil')]:
    schoolDetails?.studentCouncil ?? '-',
  [t('settings:schoolDetails.coOperatingSchoolRollNo1')]:
    schoolDetails?.coOperatingSchoolRollNo1 ?? '-',
  [t('settings:schoolDetails.coOperatingSchoolRollNo2')]:
    schoolDetails?.coOperatingSchoolRollNo2 ?? '-',
  [t('settings:schoolDetails.boardingFeeSixOrSevenDay')]:
    schoolDetails?.boardingFeeSixOrSevenDay ?? '-',
  [t('settings:schoolDetails.schoolGender')]:
    schoolDetails?.schoolGender ?? '-',
  [t('settings:schoolDetails.boardingFeeFiveDay')]:
    schoolDetails?.boardingFeeFiveDay ?? '-',
  [t('settings:schoolDetails.irishClassification')]:
    schoolDetails?.irishClassification ?? '-',
});

export default function SchoolDetails() {
  const { t } = useTranslation(['common', 'settings']);

  const { data: schoolDetails } = useSchoolsInfo();

  const schoolDetailsWithLabels = getSchoolDetailsWithLabels(
    schoolDetails ?? null,
    t
  );

  const octoberReturnsName = schoolDetails?.octoberReturnsContact
    ? schoolDetails?.octoberReturnsContact.split(' ')
    : null;

  return (
    <Stack spacing={3}>
      {schoolDetails ? (
        <>
          <Card variant="outlined">
            <CardHeader title={t('settings:schoolDetails.title')} />
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
              {Object.entries(schoolDetailsWithLabels).map(([label, value]) => (
                <Box key={label}>
                  <Typography component="dt" variant="subtitle1">
                    {label}
                  </Typography>
                  <Typography
                    component="dd"
                    variant="body1"
                    sx={{ overflowWrap: 'break-word' }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
          <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardHeader title={t('settings:schoolDetails.schoolAddress')} />
              {schoolDetails?.addresses?.map((address) => (
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
                      {t('settings:schoolDetails.address')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {address?.address1 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {address?.address2 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {address?.address3 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {address?.address4 ?? '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.localAuthority')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {address?.localAuthority ?? '-'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Stack>
          <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardHeader title={t('settings:schoolDetails.trustee')} />
              {schoolDetails?.trustees?.map((trustee) => (
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
                  <Box key="label">
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.forename')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {trustee?.forename ?? '-'}
                    </Typography>
                  </Box>
                  <Box key="label">
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.surname')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {trustee?.surname ?? '-'}
                    </Typography>
                  </Box>
                  <Box key="label">
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.address')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {trustee?.addressLine1 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {trustee?.addressLine2 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {trustee?.addressLine3 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {trustee?.addressLine4 ?? '-'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Stack>
          <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardHeader
                title={t('settings:schoolDetails.ownerInformation')}
              />
              {schoolDetails?.owners?.map((owner) => (
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
                      {t('settings:schoolDetails.forename')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {owner?.forename ?? '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.surname')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {owner?.surname ?? '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.address')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {owner?.addressLine1 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {owner?.addressLine2 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {owner?.addressLine3 ?? '-'}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {owner?.addressLine4 ?? '-'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Stack>
          <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardHeader
                title={t('settings:schoolDetails.boardOfManagementChairPerson')}
              />
              {schoolDetails?.chairPeople?.map((person) => (
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
                  <Box key="label">
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.forename')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {person?.forename ?? '-'}
                    </Typography>
                  </Box>
                  <Box key="label">
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.surname')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {person?.surname ?? '-'}
                    </Typography>
                  </Box>
                  <Box key="label">
                    <Typography component="dt" variant="subtitle1">
                      {t('settings:schoolDetails.phone')}
                    </Typography>
                    <Typography component="dd" variant="body1">
                      {person?.phoneNo ?? '-'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Stack>
          <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardHeader
                title={t('settings:schoolDetails.octoberReturnsContact')}
              />
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
                {octoberReturnsName && octoberReturnsName?.length > 0 && (
                  <>
                    <Box key="label">
                      <Typography component="dt" variant="subtitle1">
                        {t('settings:schoolDetails.forename')}
                      </Typography>
                      <Typography component="dd" variant="body1">
                        {octoberReturnsName[0] ?? '-'}
                      </Typography>
                    </Box>
                    <Box key="label">
                      <Typography component="dt" variant="subtitle1">
                        {t('settings:schoolDetails.surname')}
                      </Typography>
                      <Typography component="dd" variant="body1">
                        {octoberReturnsName[1] ?? '-'}
                      </Typography>
                    </Box>
                  </>
                )}

                <Box key="label">
                  <Typography component="dt" variant="subtitle1">
                    {t('settings:schoolDetails.phone')}
                  </Typography>
                  <Typography component="dd" variant="body1">
                    {schoolDetails?.octoberReturnsPhoneNo ?? '-'}
                  </Typography>
                </Box>
                <Box key="label">
                  <Typography component="dt" variant="subtitle1">
                    {t('settings:schoolDetails.email')}
                  </Typography>
                  <Typography component="dd" variant="body1">
                    {schoolDetails?.octoberReturnsEmail ?? '-'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Stack>
        </>
      ) : (
        <Card variant="outlined">
          <CardHeader title={t('settings:schoolDetails.title')} />
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
                {t('settings:schoolDetails.dataUnavailable')}
              </Typography>
            </Box>
          </Box>
        </Card>
      )}
    </Stack>
  );
}
