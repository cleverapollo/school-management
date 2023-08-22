import { Box } from '@mui/material';
import { LoadingPlaceholder } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

interface EmptyStateContainerProps {
  isEmpty: boolean;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  children: JSX.Element;
}

export function EmptyStateContainer({
  isEmpty,
  emptyState,
  isLoading,
  children,
}: EmptyStateContainerProps) {
  const { t } = useTranslation(['common']);

  if (isLoading) {
    return <LoadingPlaceholder sx={{ minHeight: 200, height: 'auto' }} />;
  }

  if (isEmpty) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          p: 1,
          minHeight: 200,
        }}
      >
        {emptyState ?? t('common:noResultsFound')}
      </Box>
    );
  }

  return children;
}
