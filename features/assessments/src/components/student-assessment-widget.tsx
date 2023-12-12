import {
  Card,
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
import { ChevronLeftIcon, ChevronRightIcon, FullScreenIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ActionMenu,
  LoadingPlaceholderContainer,
  TableStudyLevelChip,
} from '@tyro/core';
import {
  AssessmentType,
  useAcademicNamespace,
  usePermissions,
} from '@tyro/api';
import { useStudentDashboardAssessments } from '../api/student-dashboard-assessment';
import { useStudentAssessmentResults } from '../api/term-assessments/student-results';
import { getRowDetailsFromResult } from '../utils/get-row-details-from-result';
import { ColorCard } from './common/student-assessment-report-card/color-card';

interface StudentAssessmentWidgetProps {
  studentId: number | undefined;
}

export function StudentAssessmentWidget({
  studentId,
}: StudentAssessmentWidgetProps) {
  const { t } = useTranslation(['common', 'assessments']);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const { activeAcademicNamespace } = useAcademicNamespace();
  const { isStaffUser } = usePermissions();

  const activeAcademicNamespaceId =
    activeAcademicNamespace?.academicNamespaceId ?? 0;
  const { data: assessments = [], isLoading: isDashboardLoading } =
    useStudentDashboardAssessments(
      { studentPartyId: studentId ?? 0, published: !isStaffUser },
      activeAcademicNamespaceId,
      !!studentId
    );

  const filteredAssessments = useMemo(
    () =>
      assessments?.filter(
        (assessment) => assessment.assessmentType !== AssessmentType.StateCba
      ),
    [assessments]
  );

  const selectedAssessment = filteredAssessments?.[assessmentIndex];

  const { data: studentResults = [], isLoading: isResultsLoading } =
    useStudentAssessmentResults(
      activeAcademicNamespaceId,
      activeAcademicNamespaceId && studentId && selectedAssessment
        ? {
            studentPartyIds: [studentId],
            assessmentId: selectedAssessment?.id ?? 0,
          }
        : null
    );

  const isLoading =
    isDashboardLoading || (isResultsLoading && !!selectedAssessment);
  const hasAssessments = assessments.length > 0;

  const menuItems = filteredAssessments.map((assessment, index) => ({
    label: assessment.name,
    onClick: () => {
      setAssessmentIndex(index);
    },
  }));

  return (
    <Card variant="soft" sx={{ flex: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={1}
        mb={1}
      >
        <Typography variant="h6" component="span">
          {t('assessments:assessmentResults')}
        </Typography>
        <IconButton component={Link} to="../assessment">
          <FullScreenIcon
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton
          size="small"
          color="primary"
          aria-label={t('common:actions.previous')}
          onClick={() => {
            setAssessmentIndex(assessmentIndex - 1);
          }}
          disabled={assessmentIndex === 0 || !hasAssessments}
        >
          <ChevronLeftIcon />
        </IconButton>
        <ActionMenu
          buttonLabel={selectedAssessment?.name ?? '-'}
          buttonProps={{
            size: 'small',
            disabled: !hasAssessments,
          }}
          menuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          }}
          menuItems={menuItems}
        />

        <IconButton
          size="small"
          color="primary"
          aria-label={t('common:actions.next')}
          onClick={() => {
            setAssessmentIndex(assessmentIndex + 1);
          }}
          disabled={
            assessmentIndex + 1 === filteredAssessments?.length ||
            !hasAssessments
          }
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>
      <Card
        sx={{
          minHeight: 160,
        }}
      >
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {hasAssessments ? (
            <TableContainer>
              <Table
                size="small"
                sx={{
                  px: 0.5,
                  mb: 1,
                  borderSpacing: 0,
                  '& th, & td': {
                    px: 1,
                  },
                  '& th': {
                    background: 'transparent',
                    color: 'text.primary',
                    fontWeight: 600,
                    pb: 0.5,
                  },
                  '& td': {
                    py: 0.5,
                  },
                  '& th:first-of-type': {
                    pl: 2,
                  },
                  '& td:first-of-type': {
                    pl: 1,
                  },
                  '& td:last-of-type, & th:last-of-type': {
                    pr: 2,
                    textAlign: 'right',
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
                  {studentResults.map(({ id, ...studentResult }) => {
                    const { subject, result, grade, studyLevel } =
                      getRowDetailsFromResult(studentResult);

                    return (
                      <TableRow key={id ?? subject?.nationalCode}>
                        <TableCell>
                          <ColorCard
                            isMobile
                            text={subject?.name}
                            color={subject?.colour}
                          />
                        </TableCell>
                        <TableCell>
                          <TableStudyLevelChip level={studyLevel} condensed />
                        </TableCell>
                        <TableCell>
                          {typeof result === 'number' ? `${result}%` : '-'}
                        </TableCell>
                        <TableCell>{grade ?? '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h2" component="span">
                ✏️
              </Typography>
              <Typography
                variant="body1"
                component="span"
                color="text.secondary"
              >
                {t(`assessments:noAssessmentsAvailable`)}
              </Typography>
            </Stack>
          )}
        </LoadingPlaceholderContainer>
      </Card>
    </Card>
  );
}
