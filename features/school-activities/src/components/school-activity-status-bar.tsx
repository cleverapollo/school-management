import { Fragment } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Card, Stack, Typography, Divider, Box } from '@mui/material';
import {
  Avatar,
  CopyClipboardButton,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseSchoolActivityById } from '../api/get-school-activities';

dayjs.extend(LocalizedFormat);

type SchoolActivityStatusBarProps = {
  schoolActivity: ReturnTypeFromUseSchoolActivityById;
};

const testId = 11245;

const labelStyle = {
  fontSize: '0.75rem',
  color: 'slate.600',
};

const textValueStyle = {
  fontSize: '0.75rem',
};

export function SchoolActivityStatusBar({
  schoolActivity,
}: SchoolActivityStatusBarProps) {
  const { t } = useTranslation(['common', 'groups', 'schoolActivities']);
  const { displayName } = usePreferredNameLayout();

  const date = schoolActivity?.dates[0]?.date;
  const dayOfWeek = dayjs(date).format('ddd');
  const startTime = schoolActivity?.dates[0]?.startTime || '-';
  const endTime = schoolActivity?.dates[0]?.endTime || '-';
  const isFullDay = !schoolActivity?.dates[0]?.partial;
  const dateAndTime = isFullDay
    ? `${dayOfWeek}, (Full day)`
    : `${dayOfWeek}, ${startTime} - ${endTime}`;

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {/* ACTIVITIES DETAILS */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box p={1}>
              <Avatar src="Test" name={schoolActivity?.name ?? ''} />
            </Box>
            <Stack>
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{ maxWidth: '150px' }}
              >
                {schoolActivity?.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography component="dt" sx={{ ...labelStyle }}>
                  {t('schoolActivities:subjectYear')}
                </Typography>
                <Typography component="dd" sx={{ ...textValueStyle }}>
                  English 4th Year
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* DATE & TIME */}
          <Box
            component="dl"
            display="grid"
            gridTemplateRows="repeat(2, auto)"
            sx={{ m: 0, justifyItems: 'center', alignItems: 'baseline' }}
          >
            <>
              <Typography
                component="dt"
                gridRow={1}
                sx={{
                  fontSize: '0.75rem',
                  color: 'slate.600',
                  px: 2,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t('schoolActivities:dateAndTime')}
              </Typography>
              <Typography
                component="dd"
                gridRow={2}
                sx={{
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '17px 17px 17px 17px',
                  backgroundColor: 'blue.50',
                }}
              >
                {dateAndTime}
              </Typography>
            </>
          </Box>

          {/* GROUPS */}
          {/* <Box
            component="dl"
            display="grid"
            gridTemplateRows="repeat(2, auto)"
            sx={{ m: 0 }}
            justifyItems="center"
          >
            <>
              <Typography
                component="dt"
                gridRow={1}
                sx={{
                  ...labelStyle,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t('common:groups')}
              </Typography>
              <Box
                sx={{
                  backgroundColor: 'blue.50',
                  borderRadius: '17px 17px 17px 17px',
                  display: 'flex',
                }}
              >
                {[
                  {
                    label: t('groups:nextLesson'),
                    value: '4A',
                  },
                  {
                    label: t('groups:room'),
                    value: '4B',
                  },
                  {
                    label: t('common:teacher'),
                    value: '4C',
                  },
                ].map(({ label, value }) => (
                  <Typography
                    component="dd"
                    gridRow={2}
                    sx={{
                      ...textValueStyle,
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 1,
                      marginRight: 1,
                      '&:first-of-type': {
                        marginLeft: 1,
                      },
                      '&:last-of-type': {
                        marginRight: 1,
                      },
                    }}
                  >
                    {value}
                  </Typography>
                ))}
              </Box>
            </>
          </Box> */}

          {/* STUDENTS */}
          <Stack direction="column">
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('common:students')}
            </Typography>
            <Typography
              component="dd"
              sx={{
                ...textValueStyle,
                py: 0.5,
                textAlign: 'center',
              }}
            >
              {t('schoolActivities:totalStudents', {
                count: schoolActivity?.customGroup?.studentMembers?.memberCount,
              })}
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* TEACHERS */}
          <Stack direction="column" sx={{ alignItems: 'center' }}>
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('schoolActivities:teachers')}
            </Typography>

            <Stack direction="row">
              {schoolActivity?.customGroup?.staffMembers?.members?.map(
                (staff) => (
                  <Box
                    key={staff?.partyId}
                    sx={{
                      backgroundColor: 'slate.100',
                      borderRadius: '18px',
                      px: 1,
                      mr: 0.5,
                    }}
                  >
                    <Typography
                      component="dd"
                      sx={{
                        ...textValueStyle,
                        py: 0.5,
                        // textAlign: 'center',
                      }}
                    >
                      {displayName(staff?.person)}
                    </Typography>
                  </Box>
                )
              )}
            </Stack>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* COPY TO CLIPBOARD */}
          <Stack direction="column">
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                px: 1,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('common:tyroId')}
            </Typography>
            <CopyClipboardButton
              aria-label={t('common:tyroIdClickToCopy', { id: testId })}
              textToCopy={String(testId)}
              successMessage={t('common:tyroIdCopied')}
              errorMessage={t('common:issueCopyingTyroId')}
            />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
