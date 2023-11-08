import { Card, IconButton, Stack, Typography } from '@mui/material';
import { FullScreenIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { LoadingPlaceholderContainer } from '@tyro/core';
import { useAttendanceAwolReports } from '../../api/awol-report';

export function AWOLWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const { data: awolStudents = [], isLoading } = useAttendanceAwolReports({
    to: dayjs().format('YYYY-MM-DD'),
    from: dayjs().format('YYYY-MM-DD'),
  });

  console.log({
    awolStudents,
  });

  return (
    <Card
      variant="soft"
      sx={{
        flex: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={1}
        mb={0.5}
      >
        <Typography variant="h6" component="span">
          {t('reports:awolStudents')}
        </Typography>
        <IconButton component={Link} to="/reports/awol-students">
          <FullScreenIcon
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
        </IconButton>
      </Stack>
      <Card sx={{ minHeight: 128 }}>
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {awolStudents.length === 0 ? (
            <span>No AWOL students</span>
          ) : (
            <span>AWOL students</span>
          )}
        </LoadingPlaceholderContainer>
      </Card>
    </Card>
  );
}
