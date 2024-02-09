import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { BehaviourTypes } from './behaviour-types';
import { ReturnTypeFromBehaviourCategories } from '../../../api/behaviour/student-behaviour';

type BehaviourLevelsContainerProps = {
  categories: ReturnTypeFromBehaviourCategories[];
  isCategoriesLoading: boolean;
};

export const CategoriesContainer = ({
  categories,
  isCategoriesLoading,
}: BehaviourLevelsContainerProps) => {
  const { t } = useTranslation(['common', 'people']);

  const totalCategoryLogCount = useMemo(
    () => categories?.reduce((acc, curr) => acc + (curr?.count ?? 0), 0),
    [categories]
  );

  return isCategoriesLoading ? (
    <CircularProgress />
  ) : (
    <Box
      height="83px"
      marginBottom={6}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ backgroundColor: 'slate.50', borderRadius: 2 }}
    >
      <Stack direction="column" paddingX={3} paddingY={2}>
        <Typography variant="h6" component="h3">
          {t('people:behaviourCategories')}
        </Typography>
        <Box display="flex" flexDirection="row" alignItems="baseline">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {t('people:totalLogs', { count: totalCategoryLogCount })}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row">
        {categories?.map((type) => (
          <BehaviourTypes
            key={type?.behaviourCategoryId}
            title={type?.name ?? '-'}
            color={type?.colour ?? ''}
            count={type?.count ?? 0}
          />
        ))}
      </Stack>
    </Box>
  );
};
