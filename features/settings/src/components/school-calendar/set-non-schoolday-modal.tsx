import { Button, DialogContent, Stack, Chip } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  RHFSelect,
  RHFTextField,
  useFormValidator,
  getColourBasedOnDayType,
} from '@tyro/core';
import { Calendar_CreateCalendarDayInput, DayType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';

type SetNonSchooldayForm = {
  dayType: DayType.Holiday | DayType.StaffDay;
  description: string;
};

type SetNonSchooldayModalProps = {
  open: boolean;
  onSave: (changes: Omit<Calendar_CreateCalendarDayInput, 'date'>) => void;
  onClose: () => void;
};

const NonSchoolDayTypeOptions = [DayType.Holiday, DayType.StaffDay];

export const SetNonSchooldayModal = ({
  open,
  onSave,
  onClose,
}: SetNonSchooldayModalProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const { resolver, rules } = useFormValidator<SetNonSchooldayForm>();
  const { handleSubmit, control } = useForm<SetNonSchooldayForm>({
    resolver: resolver({
      dayType: rules.required(),
    }),
    defaultValues: {
      dayType: DayType.Holiday,
    },
  });

  const onSubmit = handleSubmit((data) => {
    onSave({
      dayType: data.dayType,
      description: data.description,
    });
    onClose();
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {t('settings:schoolCalendar.setDayType')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ py: 2 }}>
          <Stack gap={2}>
            <RHFSelect
              label={t('settings:schoolCalendar.dayType')}
              options={NonSchoolDayTypeOptions}
              renderValue={(value) => {
                const { bgColor: backgroundColor, color } =
                  getColourBasedOnDayType(value);
                return (
                  <Chip
                    label={t(`settings:schoolCalendar.dayTypeLabels.${value}`)}
                    variant="soft"
                    sx={{
                      cursor: 'pointer',
                      backgroundColor,
                      borderRadius: '14px',
                      height: '26px',
                      fontWeight: '500',
                      fontSize: '14px',
                      paddingX: '8px',
                      color,
                      '& .MuiChip-label': {
                        padding: 0,
                      },
                    }}
                  />
                );
              }}
              getOptionLabel={(option) =>
                t(`settings:schoolCalendar.dayTypeLabels.${option}`)
              }
              controlProps={{ name: 'dayType', control }}
            />
            <RHFTextField
              label={t('common:note')}
              controlProps={{
                name: 'description',
                control,
              }}
              textFieldProps={{
                fullWidth: true,
                multiline: true,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="soft" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>

          <Button type="submit" variant="contained">
            {t('common:actions.apply')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
