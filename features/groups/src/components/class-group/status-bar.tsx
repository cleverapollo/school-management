import { Card, Stack, Typography, Divider, Box } from '@mui/material';
import {
  Avatar,
  CopyClipboardButton,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { useClassGroups } from '../../api/class-groups';

interface ClassGroupOverviewBarProps {
  groupId: number | undefined;
}

export function ClassGroupStatusBar({ groupId }: ClassGroupOverviewBarProps) {
  const { t } = useTranslation(['common', 'groups']);

  const { data: classGroupData } = useClassGroups();

  const classGroup = classGroupData?.find((group) => group.partyId === groupId);

  const { displayNames } = usePreferredNameLayout();

  const tutorsNames = displayNames(classGroup?.tutors);
  const yearHeads = displayNames(classGroup?.yearGroupLeads);
  const yearGroupsNames = classGroup?.yearGroups
    ?.map(({ name }) => name)
    ?.join(', ');
  const programmeStagesNames = classGroup?.programmeStages
    ?.map((stage) => stage.programme?.name)
    .join(', ');

  const labelStyle = {
    fontSize: '0.75rem',
    color: 'slate.600',
  };

  const textValueStyle = {
    fontSize: '0.75rem',
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box p={1}>
              <Avatar src={classGroup?.avatarUrl} name={classGroup?.name} />
            </Box>

            <Stack>
              <Typography variant="subtitle1" component="h2">
                {classGroup?.name}
              </Typography>
              {[
                {
                  label: t('common:year'),
                  value: yearGroupsNames,
                },
              ].map(({ label, value }) => (
                <Stack key={label} direction="row" spacing={1}>
                  <Typography component="dt" sx={{ ...labelStyle }}>
                    {label}
                  </Typography>
                  <Typography component="dd" sx={{ ...textValueStyle }}>
                    {value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

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
              {t('common:members')}
            </Typography>
            <Typography
              component="dd"
              sx={{
                ...textValueStyle,
                py: 0.5,
              }}
            >
              {classGroup?.studentMembers?.memberCount || '-'}
            </Typography>
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
              {t('groups:yearHead', {
                count: classGroup?.yearGroupLeads?.length,
              })}
            </Typography>
            <Typography
              component="dd"
              sx={{
                ...textValueStyle,
                py: 0.5,
              }}
            >
              {yearHeads || '-'}
            </Typography>
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
              {t('groups:tutor', { count: classGroup?.tutors?.length })}
            </Typography>
            <Typography
              component="dd"
              sx={{
                ...textValueStyle,
                py: 0.5,
              }}
            >
              {tutorsNames || '-'}
            </Typography>
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
              {t('common:programme')}
            </Typography>
            <Typography
              component="dd"
              sx={{
                ...textValueStyle,
                py: 0.5,
              }}
            >
              {programmeStagesNames || '-'}
            </Typography>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

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
              aria-label={t('common:tyroIdClickToCopy', { id: groupId })}
              textToCopy={String(groupId)}
              successMessage={t('common:tyroIdCopied')}
              errorMessage={t('common:issueCopyingTyroId')}
            />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
