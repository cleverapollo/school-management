import { Card, Stack, Typography, Divider } from '@mui/material';
import {
  Avatar,
  CopyClipboardButton,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Person } from '@tyro/api';

import { useSubjectGroupById } from '../../api/subject-groups';
import { SubjectGroupOverviewNextLesson } from './subject-group-overview-next-lesson';

interface SubjectGroupOverviewBarProps {
  groupId: number | undefined;
}

export function SubjectGroupStatusBar({
  groupId,
}: SubjectGroupOverviewBarProps) {
  const { t } = useTranslation(['common', 'groups']);

  const { data: subjectGroupData } = useSubjectGroupById(groupId);
  const { displayName } = usePreferredNameLayout();

  const yearGroupsNames = subjectGroupData?.yearGroups
    ?.map(({ name }) => name)
    .join(', ');

  const teachersNames = subjectGroupData?.teachers
    ?.map((teacher) => displayName(teacher as Person))
    .join(', ');

  const labelStyle = {
    fontSize: '0.75rem',
    color: 'slate.600',
  };

  const textValueStyle = {
    fontSize: '0.75rem',
  };

  return (
    <Card variant="outlined" sx={{ py: 1.5, px: 2.5, my: 2 }}>
      <Stack
        direction="row"
        sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={subjectGroupData?.avatarUrl ?? undefined}
            name={subjectGroupData?.name}
          />

          <Stack>
            <Typography variant="subtitle1" component="h2">
              {subjectGroupData?.name}
            </Typography>
            {[
              {
                label: t('groups:subject'),
                value: subjectGroupData?.subject?.name,
              },
              {
                label: t('groups:year'),
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

        <SubjectGroupOverviewNextLesson groupId={groupId!} />

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
            {t('groups:teachers')}
          </Typography>
          <Typography
            component="dd"
            sx={{
              ...textValueStyle,
              py: 0.5,
            }}
          >
            {teachersNames || '-'}
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
  );
}
