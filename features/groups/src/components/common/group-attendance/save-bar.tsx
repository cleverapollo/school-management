import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { EditState, SaveBarButton, SaveBarContainer } from '@tyro/core';
import dayjs from 'dayjs';
import { StudentAttendance } from '../../../hooks';
import { AttendanceBreakdown } from './breakdown';

type SaveBarProps = {
  isFirstTime: boolean;
  editingState: EditState;
  attendance: StudentAttendance;
  updatedAt: string;
  updatedBy: string;
  unsavedChanges: number;
  onSave: () => void;
  onCancel: () => void;
};

export const SaveBar = ({
  isFirstTime,
  editingState,
  attendance,
  updatedAt,
  updatedBy,
  unsavedChanges,
  onCancel,
  onSave,
}: SaveBarProps) => {
  const { t } = useTranslation(['common', 'groups']);

  const hasChanges = unsavedChanges > 0;
  const showActions = hasChanges || isFirstTime;

  return (
    <SaveBarContainer
      slideProps={{ in: true }}
      contentProps={{
        justifyContent: 'space-between',
        gap: 6,
        px: 3.25,
        py: 1,
        flex: 1,
      }}
    >
      <Stack gap={0.5}>
        <Stack flexDirection="row" justifyContent="space-between">
          {showActions
            ? (isFirstTime
                ? [t('common:unconfirmed')]
                : [
                    t('common:unsavedChanges', { count: unsavedChanges }),
                    t('groups:byYou'),
                  ]
              ).map((label) => (
                <Typography key={label} variant="subtitle2" component="span">
                  {label}
                </Typography>
              ))
            : [
                t('groups:lastSaved', {
                  date: dayjs(updatedAt).format('L'),
                  time: dayjs(updatedAt).format('LT'),
                }),
                t('groups:updatedBy', { updatedBy }),
              ].map((text) => (
                <Typography key={text} variant="subtitle2" component="span">
                  {text}
                </Typography>
              ))}
        </Stack>

        <AttendanceBreakdown
          padding={0.75}
          borderRadius={5}
          attendance={attendance}
        />
      </Stack>

      {showActions && (
        <Stack flexDirection="row" gap={2}>
          {hasChanges && (
            <Button
              variant="soft"
              color="primary"
              disabled={editingState === EditState.Saving}
              onClick={onCancel}
            >
              {t('common:actions.cancel')}
            </Button>
          )}
          <SaveBarButton
            editingState={editingState}
            label={t(`common:actions.${hasChanges ? 'save' : 'confirm'}`)}
            onClick={onSave}
          />
        </Stack>
      )}
    </SaveBarContainer>
  );
};
