import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { useStudentDashboardAssessments } from '../api/student-dashboard-assessment';

interface StudentAssessmentWidgetProps {
  studentId: number | undefined;
}

export function StudentAssessmentWidget({
  studentId,
}: StudentAssessmentWidgetProps) {
  const { t } = useTranslation(['assessment']);
  const { data } = useStudentDashboardAssessments(studentId);

  return (
    <Card sx={{ maxWidth: 380, flex: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 3,
          pr: 2.25,
          pt: 2.25,
          pb: 1.25,
        }}
      >
        <CardHeader
          component="h3"
          title={t('assessment:assessmentResults')}
          sx={{ p: 0, m: 0 }}
        />
        <IconButton component={Link} to="../assessment">
          <ExternalLinkIcon sx={{ width: 20, height: 20 }} />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.25,
          py: 1,
          borderWidth: '1px 0',
          borderStyle: 'solid',
          borderColor: 'divider',
        }}
      >
        <IconButton size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ flex: 1, overflowX: 'hidden' }}>
          <Typography
            component="h4"
            variant="subtitle2"
            noWrap
            sx={{ px: 2, textOverflow: 'ellipsis' }}
          >
            A really long assessment name that will wrap
          </Typography>
        </Box>
        <IconButton size="small">
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </Card>
  );
}
