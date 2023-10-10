import { IconButton, IconButtonProps } from '@mui/material';
import { CloseIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

type DialogCloseButtonProps = IconButtonProps;

export function DialogCloseButton({ sx, ...props }: DialogCloseButtonProps) {
  const { t } = useTranslation(['common']);

  return (
    <IconButton
      size="small"
      aria-label={t('common:actions.close')}
      {...props}
      sx={{
        width: 30,
        height: 30,
        backgroundColor: 'slate.100',
        '&:hover': {
          backgroundColor: 'slate.200',
        },
        ...(sx ?? {}),
      }}
    >
      <CloseIcon
        sx={{
          color: 'slate.500',
        }}
      />
    </IconButton>
  );
}
