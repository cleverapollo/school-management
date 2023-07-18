import { Backdrop, Popper, PopperProps, useTheme } from '@mui/material';

export function DatePickerPopper(props: PopperProps) {
  const { open } = props;
  const { zIndex } = useTheme();

  return (
    <>
      <Popper
        {...props}
        sx={{
          ...props?.sx,
          zIndex: zIndex.modal,
        }}
      />
      <Backdrop open={open} sx={{ opacity: '0 !important' }} />
    </>
  );
}
