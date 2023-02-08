import { ComponentType, useRef } from 'react';
import { SnackbarProvider as NotistackProvider, SnackbarKey } from 'notistack';
import { alpha } from '@mui/material/styles';
import { Box, IconButton, SvgIconProps } from '@mui/material';
import {
  CheckmarkCircleIcon,
  CloseIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  WarningIcon,
} from '@tyro/icons';
import StyledNotistack from './styles';

type Props = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: Props) {
  const notistackRef = useRef<any>(null);

  const onClose = (key: SnackbarKey) => () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <>
      <StyledNotistack />

      <NotistackProvider
        ref={notistackRef}
        dense
        maxSnack={5}
        preventDuplicate
        autoHideDuration={3000}
        variant="success" // Set default variant
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        iconVariant={{
          info: <ToastIcon Icon={InfoCircleIcon} color="info" />,
          success: <ToastIcon Icon={CheckmarkCircleIcon} color="success" />,
          warning: <ToastIcon Icon={WarningIcon} color="warning" />,
          error: <ToastIcon Icon={ErrorCircleIcon} color="error" />,
        }}
        action={(key) => (
          <IconButton size="small" onClick={onClose(key)} sx={{ p: 0.5 }}>
            <CloseIcon />
          </IconButton>
        )}
      >
        {children}
      </NotistackProvider>
    </>
  );
}

// ----------------------------------------------------------------------

type ToastIconProps = {
  Icon: ComponentType<SvgIconProps>;
  color: 'info' | 'success' | 'warning' | 'error';
};

function ToastIcon({ Icon, color }: ToastIconProps) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      <Icon sx={{ width: 24 }} />
    </Box>
  );
}
