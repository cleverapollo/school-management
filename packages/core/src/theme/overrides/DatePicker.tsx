import { Theme } from '@mui/material/styles';
import { CalendarMonthAltIcon } from '@tyro/icons';

export default function DatePicker(theme: Theme) {
  return {
    MuiDatePicker: {
      defaultProps: {
        inputFormat: 'dd/MM/yyyy',
        slots: {
          openPickerIcon: () => <CalendarMonthAltIcon />,
        },
        slotProps: {
          openPickerButton: {
            sx: {
              color: 'slate.main',
            },
          },
        },
      },
    },
  };
}
