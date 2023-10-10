import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Notes_BehaviourType, Notes_StudentBehaviour } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { Types } from './types';
import { ReturnTypeFromUseBehaviourLevels } from '../../../api/behaviour/behaviour-levels';
import { ReturnTypeFromBehaviourCategories } from '../../../api/behaviour/individual-student-behaviour';

type BehaviourLevelsContainerProps = {
  categories: ReturnTypeFromBehaviourCategories[];
  isCategoriesLoading: boolean;
};

export const BehaviourLevelsContainer = ({
  categories,
  isCategoriesLoading,
}: BehaviourLevelsContainerProps) => {
  const { t } = useTranslation(['common', 'people']);
  const totalLogs = 10;

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
          {t('people:logByLevels')}
        </Typography>
        <Box display="flex" flexDirection="row" alignItems="baseline">
          {/* This is in the design, maybe will be implemented in next version. */}
          {/* <Typography variant="subtitle2" color="indigo.500">
            1 reward overdue{' '}
          </Typography> */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {t('people:totalLogs', { count: categories?.length })}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row">
        {categories?.map((type) => (
          <Types
            title={type?.name ?? ''}
            color={type?.colour ?? ''}
            count={type?.count ?? 0}
          />
        ))}
      </Stack>
    </Box>
  );
};
