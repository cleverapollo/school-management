import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  TableContainer,
} from '@mui/material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStudentDashboardAssessments } from '../api/student-dashboard-assessment';

interface StudentAssessmentWidgetProps {
  studentId: number | undefined;
}

export function StudentAssessmentWidget({
  studentId,
}: StudentAssessmentWidgetProps) {
  const { t } = useTranslation(['common', 'assessments']);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const { data } = useStudentDashboardAssessments(
    { studentPartyId: studentId ?? 0, published: true },
    null,
    !!studentId
  );

  const selectedAssessment = data?.[assessmentIndex];

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1, pb: 2 }}>
      <CardHeader
        component="h3"
        title={t('assessments:assessmentResults')}
        action={
          <IconButton component={Link} to="../assessment">
            <ExternalLinkIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        }
      />
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setAssessmentIndex(assessmentIndex - 1);
          }}
          disabled={assessmentIndex === 0}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ flex: 1, overflowX: 'hidden' }}>
          <Typography
            component="h4"
            variant="subtitle2"
            noWrap
            sx={{ px: 2, textOverflow: 'ellipsis', textAlign: 'center' }}
          >
            {selectedAssessment?.name}
          </Typography>
        </Box>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setAssessmentIndex(assessmentIndex + 1);
          }}
          disabled={assessmentIndex + 1 === data?.length}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>
      <TableContainer>
        <Table
          size="small"
          sx={{
            mt: 1,
            '& td:first-of-type, & th:first-of-type': {
              pl: 3,
            },
            '& td:last-of-type, & th:last-of-type': {
              pr: 3,
            },
            '& td:nth-of-type(n + 3), & th:nth-of-type(n + 3)': {
              textAlign: 'right',
            },
            '& th, & td:last-of-type': {
              background: 'transparent',
              color: 'text.primary',
              fontWeight: 700,
            },
            '& th': {
              py: 2,
            },
            '& td': {
              color: 'text.secondary',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>{t('common:subject')}</TableCell>
              <TableCell>{t('common:level')}</TableCell>
              <TableCell>{t('common:grade')}</TableCell>
              <TableCell>{t('common:result')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedAssessment?.results?.map((result) => (
              <TableRow key={result?.id}>
                <TableCell>{result?.subject ?? '-'}</TableCell>
                <TableCell>
                  {result?.studyLevel
                    ? t(`common:studyLevel.${result?.studyLevel}`)
                    : '-'}
                </TableCell>
                <TableCell>
                  {typeof result?.result === 'number'
                    ? `${result?.result}%`
                    : '-'}
                </TableCell>
                <TableCell>{result?.grade ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
