import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseSchoolActivityById } from '../api/get-school-activities';
import { formatActivityDates } from '../utils/format-activity-dates';
import { PublishDropdown } from './publish-dropdown';

dayjs.extend(LocalizedFormat);

type SchoolActivityStatusBarProps = {
  schoolActivity: ReturnTypeFromUseSchoolActivityById;
};

const labelStyle = {
  fontSize: '0.75rem',
  color: 'slate.600',
};

const textValueStyle = {
  fontSize: '0.75rem',
};

export function SchoolActivityStatusBar({
  schoolActivity: {
    name,
    customGroup,
    published,
    schoolActivityId,
    dates,
    lastPublished,
  },
}: SchoolActivityStatusBarProps) {
  const { t } = useTranslation(['common', 'groups', 'schoolActivities']);
  const { displayName } = usePreferredNameLayout();

  const formattedDates = formatActivityDates(dates);

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" flexWrap="wrap" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box p={1}>
              <Avatar src={customGroup?.avatarUrl} name={name ?? ''} />
            </Box>
            <Stack>
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{ maxWidth: '150px' }}
              >
                {name}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="column" sx={{ alignItems: 'start' }}>
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('schoolActivities:dateAndTime')}
            </Typography>

            <Stack direction="row">
              <Box
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
                  }}
                >
                  {formattedDates}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack direction="column" sx={{ alignItems: 'start' }}>
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('common:group')}
            </Typography>

            <Stack direction="row">
              <Box
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
                  }}
                >
                  {customGroup?.name}
                </Typography>
              </Box>
            </Stack>
          </Stack>

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
                count: customGroup?.studentMembers?.memberCount,
              })}
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Stack direction="column" sx={{ alignItems: 'start' }}>
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
              {customGroup?.staffMembers?.members
                ?.filter((_, index) => index < 2)
                ?.map((staff) => (
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
                      }}
                    >
                      {displayName(staff?.person)}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <Stack direction="column" sx={{ alignItems: 'start', mr: 2 }}>
            <Typography
              component="dt"
              variant="body1"
              sx={{
                ...labelStyle,
                py: 0.5,
                mb: 0.5,
              }}
            >
              {t('schoolActivities:publishStatus')}
            </Typography>
            <PublishDropdown
              isPublished={published}
              schoolActivityId={schoolActivityId}
              lastPublished={lastPublished ?? null}
            />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
