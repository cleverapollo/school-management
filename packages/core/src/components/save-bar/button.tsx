import LoadingButton from '@mui/lab/LoadingButton';
import { ThumbsUpCheckmarkIcon } from '@tyro/icons';
import { ComponentProps, useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { EditState } from './types';

type SaveBarButtonProps = ComponentProps<typeof LoadingButton> & {
  editingState: EditState;
  label?: string;
};

export function SaveBarButton({
  children,
  editingState,
  label,
  ...restButtonProps
}: SaveBarButtonProps) {
  const { t } = useTranslation(['common']);

  const isSaved = editingState === EditState.Saved;
  const isSaving = editingState === EditState.Saving;

  const getButtonLabel = useMemo(() => {
    switch (editingState) {
      case EditState.Saving:
        return t('common:saving');
      case EditState.Saved:
        return t('common:saved');
      default:
        return label ?? t('common:actions.save');
    }
  }, [editingState, label]);

  return (
    <LoadingButton
      loading={isSaving}
      variant={isSaved ? 'soft' : 'contained'}
      color={isSaved ? 'success' : 'primary'}
      {...(isSaved && {
        loadingPosition: 'end',
        endIcon: <ThumbsUpCheckmarkIcon />,
      })}
      {...restButtonProps}
      sx={{
        transitionProperty: 'all',
        transitionTimingFunction: 'ease-in-out',
        transitionDuration: '150ms',
        ...restButtonProps.sx,
      }}
    >
      {getButtonLabel}
    </LoadingButton>
  );
}
