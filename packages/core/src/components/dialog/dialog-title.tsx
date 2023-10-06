import {
  DialogTitle as MUIDialogTitle,
  DialogTitleProps as MUIDialogTitleProps,
  IconButton,
  Stack,
  StackProps,
} from '@mui/material';
import { CloseIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

export interface DialogTitleProps extends MUIDialogTitleProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: () => void;
  containerProps?: StackProps;
}

export function DialogTitle({
  onClose,
  containerProps,
  ...props
}: DialogTitleProps) {
  const { t } = useTranslation(['common']);

  return (
    <Stack
      direction="row"
      p={3}
      alignItems="center"
      justifyContent="space-between"
      position="relative"
      {...containerProps}
    >
      <MUIDialogTitle p="0 !important" {...props} />
      {typeof onClose === 'function' && (
        <IconButton
          size="small"
          onClick={onClose}
          aria-label={t('common:actions.close')}
          sx={{
            position: 'absolute',
            right: 24,
            width: 30,
            height: 30,
            backgroundColor: 'slate.100',
            '&:hover': {
              backgroundColor: 'slate.200',
            },
          }}
        >
          <CloseIcon
            sx={{
              color: 'slate.500',
            }}
          />
        </IconButton>
      )}
    </Stack>
  );
}
