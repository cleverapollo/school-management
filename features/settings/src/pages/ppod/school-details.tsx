import { useMemo } from 'react';
import { Box, Card, CardHeader, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useSchoolsInfo } from '../../api/ppod';

export default function SchoolDetails() {
  const { t } = useTranslation(['common', 'settings']);

  const { data: schoolDetails } = useSchoolsInfo();
  console.log(schoolDetails, 'DATA');

  const mockData = {
    id: '1',
    rollNo: '12345C',
    name: 'Coláiste Éanna',
    email: 'info@colaisteeanna.ie',
    website: 'https://example.com',
    fax: '+1-123-456-7890',
    principal: {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    },
    boardingFeeFiveDay: 'No',
    boardingFeeSixOrSevenDay: 'No',
    schoolGender: 'male',
    parentAssociation: 'Yes',
    studentCouncil: 'Yes',
    boardOfManagement: {
      name: 'Board of Management',
      email: 'boardofmanagement@example.com',
    },
    irishClassification: 'Some subjects taught through Irish',
    coOperatingSchoolRollNo1: '12345A',
    coOperatingSchoolRollNo2: '12345B',
    octoberReturnsContact: 'John Doe',
    octoberReturnsPhoneNo: '+1-123-456-7890',
    octoberReturnsFaxNo: '+1-123-456-7890',
    octoberReturnsEmail: 'johndoe@example.com',
    phones: [{ phone: '+1-123-456-7890' }],
    addresses: [
      {
        address1: '123 School Lane',
        address2: 'Rathfarnham',
        address3: 'Dublin',
        address4: 'Address Line 4',
        county: 'Dublin',
        localAuthority: 'Dublin City Council',
      },
    ],
    chairPeople: [
      {
        chairPersonId: '1',
        forename: 'John',
        surname: 'Doe',
        phoneNo: '+1-123-456-7890',
        startDate: '2022-01-01T00:00:00Z',
        endDate: '2022-12-31T23:59:59Z',
      },
    ],
    owners: [
      {
        ownerId: '1',
        forename: 'John',
        surname: 'Doe',
        addressLine1: 'Bacon house',
        addressLine2: 'Stake road',
        addressLine3: 'Address Line 3',
        addressLine4: 'Dublin 7',
        startDate: '2022-01-01T00:00:00Z',
        endDate: '2022-12-31T23:59:59Z',
      },
    ],
    trustees: [
      {
        trusteeId: '1',
        forename: 'John',
        surname: 'Doe',
        addressLine1: '54 Trustee Road',
        addressLine2: 'Booterstown',
        addressLine3: 'Address Line 3',
        addressLine4: 'Dublin 16',
        startDate: '2022-01-01T00:00:00Z',
        endDate: '2022-12-31T23:59:59Z',
      },
    ],
  };

  const schoolInfo = useMemo(() => {
    const data =
      schoolDetails && Object.keys(schoolDetails).length > 0
        ? schoolDetails
        : mockData;
    return data;
  }, [schoolDetails]);
  console.log(schoolInfo, 'schoolInfo');

  const octoberReturnsName = mockData?.octoberReturnsContact.split(' ');

  return (
    <Stack spacing={3}>
      {/* School Details */}
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
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.name')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.name}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.rollNo')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.rollNo}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.phone')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.phones[0].phone}
            </Typography>
          </Box>

          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.email')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.email}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.parentAssociation')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.parentAssociation}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.studentCouncil')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.studentCouncil}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.coOperatingSchoolRollNo1')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.coOperatingSchoolRollNo1}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.website')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.website}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.coOperatingSchoolRollNo2')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.coOperatingSchoolRollNo2}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.boardingFeeSixOrSevenDay')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.boardingFeeSixOrSevenDay}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.schoolGender')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.schoolGender}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.boardingFeeFiveDay')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.boardingFeeFiveDay}
            </Typography>
          </Box>
          <Box key="label">
            <Typography component="dt" variant="subtitle1">
              {t('settings:schoolDetails.irishClassification')}
            </Typography>
            <Typography component="dd" variant="body1">
              {mockData?.irishClassification}
            </Typography>
          </Box>
        </Box>
      </Card>
      {/* School Address */}
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader title={t('settings:schoolDetails.schoolAddress')} />
          {mockData?.addresses.map((address) => (
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
                  {address?.address1}
                </Typography>
                <Typography component="dd" variant="body1">
                  {address?.address2}
                </Typography>
                <Typography component="dd" variant="body1">
                  {address?.address3}
                </Typography>
                <Typography component="dd" variant="body1">
                  {address?.address4}
                </Typography>
              </Box>
              <Box>
                <Typography component="dt" variant="subtitle1">
                  {t('settings:schoolDetails.localAuthority')}
                </Typography>
                <Typography component="dd" variant="body1">
                  {address?.localAuthority}
                </Typography>
              </Box>
            </Box>
          ))}
        </Card>
      </Stack>
      {/* Trustee */}
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader title={t('settings:schoolDetails.trustee')} />
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
                {mockData?.trustees[0]?.forename}
              </Typography>
            </Box>
            <Box key="label">
              <Typography component="dt" variant="subtitle1">
                {t('settings:schoolDetails.surname')}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.trustees[0]?.surname}
              </Typography>
            </Box>
            <Box key="label">
              <Typography component="dt" variant="subtitle1">
                {t('settings:schoolDetails.address')}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.trustees[0]?.addressLine1}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.trustees[0]?.addressLine2}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.trustees[0]?.addressLine3}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.trustees[0]?.addressLine4}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Stack>
      {/* Owner Info */}
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader title={t('settings:schoolDetails.ownerInformation')} />
          {mockData?.owners.map((owner) => (
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
                  {owner?.forename}
                </Typography>
              </Box>
              <Box>
                <Typography component="dt" variant="subtitle1">
                  {t('settings:schoolDetails.surname')}
                </Typography>
                <Typography component="dd" variant="body1">
                  {owner?.surname}
                </Typography>
              </Box>
              <Box>
                <Typography component="dt" variant="subtitle1">
                  {t('settings:schoolDetails.address')}
                </Typography>
                <Typography component="dd" variant="body1">
                  {owner?.addressLine1}
                </Typography>
                <Typography component="dd" variant="body1">
                  {owner?.addressLine2}
                </Typography>
                <Typography component="dd" variant="body1">
                  {owner?.addressLine3}
                </Typography>
                <Typography component="dd" variant="body1">
                  {owner?.addressLine4}
                </Typography>
              </Box>
            </Box>
          ))}
        </Card>
      </Stack>
      {/* Board of management chairperson */}
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader
            title={t('settings:schoolDetails.boardOfManagementChairPerson')}
          />
          {mockData?.chairPeople.map((person) => (
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
                  {person?.forename}
                </Typography>
              </Box>
              <Box key="label">
                <Typography component="dt" variant="subtitle1">
                  {t('settings:schoolDetails.surname')}
                </Typography>
                <Typography component="dd" variant="body1">
                  {person?.surname}
                </Typography>
              </Box>
              <Box key="label">
                <Typography component="dt" variant="subtitle1">
                  {t('settings:schoolDetails.phone')}
                </Typography>
                <Typography component="dd" variant="body1">
                  {person?.phoneNo}
                </Typography>
              </Box>
            </Box>
          ))}
        </Card>
      </Stack>
      {/* October Returns Contact Info */}
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
            {octoberReturnsName?.length > 0 && (
              <>
                <Box key="label">
                  <Typography component="dt" variant="subtitle1">
                    {t('settings:schoolDetails.forename')}
                  </Typography>
                  <Typography component="dd" variant="body1">
                    {octoberReturnsName[0]}
                  </Typography>
                </Box>
                <Box key="label">
                  <Typography component="dt" variant="subtitle1">
                    {t('settings:schoolDetails.surname')}
                  </Typography>
                  <Typography component="dd" variant="body1">
                    {octoberReturnsName[1]}
                  </Typography>
                </Box>
              </>
            )}

            <Box key="label">
              <Typography component="dt" variant="subtitle1">
                {t('settings:schoolDetails.phone')}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.octoberReturnsPhoneNo}
              </Typography>
            </Box>
            <Box key="label">
              <Typography component="dt" variant="subtitle1">
                {t('settings:schoolDetails.email')}
              </Typography>
              <Typography component="dd" variant="body1">
                {mockData?.octoberReturnsEmail}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Stack>
    </Stack>
  );
}
