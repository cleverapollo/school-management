import { Button, Stack } from '@mui/material';
import {
  RHFSwitch,
  RHFTextField,
  useFormValidator,
  DialogActions,
  Dialog,
  DialogTitle,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { UpsertRoomInput } from '@tyro/api';
import { useEffect } from 'react';
import { useCreateOrUpdateRoom } from '../../api/add-or-update-room';
import { ReturnTypeFromUseCoreRooms } from '../../pages/rooms';

export type EditRoomFormState = Pick<
  UpsertRoomInput,
  'roomId' | 'name' | 'description' | 'capacity' | 'location' | 'disabled'
> & {
  active?: boolean;
};

export type EditRoomDetailsViewProps = {
  initialRoomState?: Partial<EditRoomFormState> | null;
  rooms: ReturnTypeFromUseCoreRooms[];
  onClose: () => void;
};

export const EditRoomDetailsModal = ({
  initialRoomState,
  rooms,
  onClose,
}: EditRoomDetailsViewProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const {
    mutate: createOrUpdateRoomMutation,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
  } = useCreateOrUpdateRoom();

  const { resolver, rules } = useFormValidator<EditRoomFormState>();

  const defaultFormStateValues: Partial<EditRoomFormState> = {
    ...initialRoomState,
    active: !initialRoomState?.disabled ?? true,
  };

  const roomsWithoutSelf = rooms.filter(
    (room) => room?.roomId !== initialRoomState?.roomId
  );

  const { control, handleSubmit, reset } = useForm<EditRoomFormState>({
    resolver: resolver({
      name: [
        rules.required(),
        rules.isUniqueByKey(
          roomsWithoutSelf,
          'name',
          t('settings:roomNameShouldBeUnique')
        ),
      ],
      description: [rules.required()],
      capacity: [rules.required(), rules.min(0)],
      location: [rules.required()],
    }),
    defaultValues: defaultFormStateValues,
    mode: 'onChange',
  });

  const onSubmit = ({ active, ...restData }: EditRoomFormState) => {
    createOrUpdateRoomMutation(
      {
        ...restData,
        disabled: !active,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  useEffect(() => {
    if (initialRoomState) {
      reset({ ...defaultFormStateValues, ...initialRoomState });
    }
  }, [initialRoomState]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={!!initialRoomState}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle onClose={onClose}>
        {initialRoomState?.roomId
          ? t('settings:editRoom')
          : t('settings:addRoom')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField<EditRoomFormState>
            label={t('common:name')}
            controlProps={{
              name: 'name',
              control,
            }}
          />

          <RHFTextField<EditRoomFormState>
            label={t('settings:capacity')}
            controlProps={{
              name: 'capacity',
              control,
            }}
            textFieldProps={{
              type: 'number',
            }}
          />

          <RHFTextField<EditRoomFormState>
            label={t('common:description')}
            controlProps={{
              name: 'description',
              control,
            }}
            textFieldProps={{
              multiline: true,
              rows: 4,
            }}
          />

          <RHFTextField<EditRoomFormState>
            label={t('common:location')}
            controlProps={{
              name: 'location',
              control,
            }}
          />

          <RHFSwitch<EditRoomFormState>
            label={t('settings:active')}
            switchProps={{
              color: 'primary',
            }}
            controlProps={{
              name: 'active',
              control,
            }}
          />
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {initialRoomState?.roomId
              ? t('common:actions.edit')
              : t('common:actions.add')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
