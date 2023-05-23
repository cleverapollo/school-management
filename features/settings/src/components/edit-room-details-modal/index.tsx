import {
  Button,
  DialogTitle,
  Stack,
  DialogActions,
  Dialog,
} from '@mui/material';
import { RHFSwitch, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { UpsertRoomInput } from '@tyro/api';
import { useEffect } from 'react';
import { useCreateOrUpdateRoom } from '../../api/add-or-update-room';

export type EditRoomFormState = Pick<
  UpsertRoomInput,
  'roomId' | 'name' | 'description' | 'capacity' | 'location' | 'disabled'
>;

export type EditRoomDetailsViewProps = {
  initialRoomState?: Partial<EditRoomFormState> | null;
  onClose: () => void;
};

export const EditRoomDetailsModal = ({
  initialRoomState,
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
    name: initialRoomState?.name,
    description: initialRoomState?.description,
    capacity: initialRoomState?.capacity,
    location: initialRoomState?.location,
    disabled: initialRoomState?.roomId ? !initialRoomState?.disabled : true,
  };

  const { control, handleSubmit, watch, reset } = useForm<EditRoomFormState>({
    resolver: resolver({
      name: rules.required(),
      description: rules.required(),
      capacity: rules.required(),
      location: rules.required(),
    }),
    defaultValues: defaultFormStateValues,
    mode: 'onChange',
  });

  const onSubmit = ({ disabled, ...restData }: EditRoomFormState) => {
    createOrUpdateRoomMutation(
      {
        disabled: !disabled,
        ...restData,
      },
      {
        onSuccess: onClose,
        // TODO: handle error message from server
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

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
      <DialogTitle>
        {initialRoomState?.roomId
          ? t('settings:editRoom')
          : t('settings:addRoom')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField<EditRoomFormState>
            textFieldProps={{
              sx: { display: 'none' },
            }}
            controlProps={{
              name: 'roomId',
              defaultValue: initialRoomState?.roomId,
              control,
            }}
          />

          <RHFTextField<EditRoomFormState>
            label={t('common:name')}
            controlProps={{
              name: 'name',
              defaultValue: initialRoomState?.name,
              control,
            }}
          />

          <RHFTextField<EditRoomFormState>
            label={t('settings:capacity')}
            controlProps={{
              name: 'capacity',
              defaultValue: initialRoomState?.capacity,
              control,
            }}
            textFieldProps={{
              type: 'number',
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 0,
              },
            }}
          />

          <RHFTextField<EditRoomFormState>
            label={t('common:description')}
            controlProps={{
              name: 'description',
              defaultValue: initialRoomState?.description,
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
              defaultValue: initialRoomState?.location,
              control,
            }}
          />

          <RHFSwitch<EditRoomFormState>
            label={t('settings:active')}
            switchProps={{
              color: 'success',
            }}
            controlProps={{
              name: 'disabled',
              defaultValue: initialRoomState?.roomId
                ? !initialRoomState?.disabled
                : true,
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
