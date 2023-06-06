import { useSnackbar } from 'notistack';

export function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return {
    toast: enqueueSnackbar,
    closeAllToasts: closeSnackbar,
  };
}

export type ReturnOfUseToast = ReturnType<typeof useToast>;
