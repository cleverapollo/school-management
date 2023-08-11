import { useMemo, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import {
  LoadingPlaceholder,
  RHFTextField,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { ReturnTypeOfUseCoverTable } from '../../../hooks/use-cover-table';
import {
  ReturnTypeFromUseCoverLookup,
  useCoverLookup,
} from '../../../api/staff-work-cover-lookup';
import { SubstitutionTypeDropdown } from '../substitution-type-select';
import { ApplyCoverRoomOption, RoomsAutocomplete } from './rooms-autocomplete';
import { CoverSelectionTable } from './cover-selection-table';
import { getCurrentCoverRoom } from '../../../utils/cover-utils';
import { useApplyCover } from '../../../api/apply-cover';
import { AdditionalTeacherList } from './additional-teacher-list';

interface ApplyCoverFormState {
  substituteStaff: ReturnTypeFromUseCoverLookup['staff'][number]['staff']['person'];
  room: ApplyCoverRoomOption | undefined;
  coverType: number;
  note: string | undefined;
}

interface ApplyCoverModalProps {
  open: boolean;
  onClose: () => void;
  eventsMap: ReturnTypeOfUseCoverTable['selectedEventsMap'] | null;
}

export function ApplyCoverModal({
  open,
  onClose,
  eventsMap,
}: ApplyCoverModalProps) {
  const { t } = useTranslation(['common', 'substitution']);
  const { displayName } = usePreferredNameLayout();

  const substitutionEventIds = useMemo(() => {
    if (!eventsMap) return [];

    return Array.from(eventsMap.values()).map(({ event }) => ({
      eventId: event.eventId,
      date: dayjs(event.startTime).format('YYYY-MM-DD'),
    }));
  }, [eventsMap]);

  const { mutateAsync: applyCover, isLoading: isSaving } = useApplyCover();
  const { data, isLoading } = useCoverLookup(
    { substitutionEventIds },
    !!substitutionEventIds.length
  );

  const { resolver, rules } = useFormValidator<ApplyCoverFormState>();

  const { reset, control, handleSubmit, watch } = useForm<ApplyCoverFormState>({
    resolver: resolver({
      substituteStaff: rules.required(
        t('substitution:youMustSelectACoverStaffMember')
      ),
      coverType: rules.required(),
    }),
  });

  const selectedStaff = watch('substituteStaff');
  const eventList = useMemo(
    () =>
      Array.from(eventsMap?.values() ?? [])
        .map(({ event }) => event.name)
        .join(', '),
    [eventsMap]
  );
  const rooms = useMemo(() => {
    const roomList = Array.from(eventsMap?.values() ?? []).map((eventInfo) =>
      getCurrentCoverRoom(eventInfo)
    );

    return Array.from(new Set(roomList));
  }, [eventsMap]);

  const onSave = handleSubmit(({ substituteStaff, room, coverType, note }) => {
    const events = Array.from(eventsMap?.values() ?? []).map(
      ({ absenceId, event, staffPartyId }) => ({
        eventId: event.eventId,
        originalStaffId: staffPartyId,
        substituteStaffId: substituteStaff.partyId,
        absenceId,
        substitutionTypeId: coverType,
        date: dayjs(event.startTime).format('YYYY-MM-DD'),
        ...(note && { note }),
        ...(room && {
          substituteRoomId: room.roomId,
        }),
      })
    );

    applyCover(
      {
        events,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  });

  useEffect(() => {
    reset();
  }, [eventsMap]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <form onSubmit={onSave}>
        <DialogTitle>{t('substitution:applyCover')}</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <LoadingPlaceholder sx={{ minHeight: 200 }} />
          ) : (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2">
                  {t('substitution:applyCoverForList', { list: eventList })}
                </Typography>
                <AdditionalTeacherList eventsMap={eventsMap} />
              </Box>
              <CoverSelectionTable
                staffList={data?.staff ?? []}
                controlProps={{
                  name: 'substituteStaff',
                  control,
                }}
              />
              <RHFTextField
                label={
                  t('substitution:noteForSelectedTeacher') +
                  (selectedStaff ? ` (${displayName(selectedStaff)})` : '')
                }
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  rows: 3,
                }}
                controlProps={{
                  name: 'note',
                  control,
                }}
              />
              <Stack direction="row" spacing={2}>
                <RoomsAutocomplete
                  data={data}
                  inputProps={{
                    helperText: `${t('substitution:currentRoom', {
                      count: rooms.length,
                    })}: ${rooms.join(', ')}`,
                  }}
                  controlProps={{
                    name: 'room',
                    control,
                  }}
                />
                <SubstitutionTypeDropdown
                  label={t('substitution:coverType')}
                  controlProps={{
                    name: 'coverType',
                    control,
                  }}
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="soft" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSaving}>
            {t('common:actions.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}