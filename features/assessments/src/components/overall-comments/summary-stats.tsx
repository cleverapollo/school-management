import { Card, Stack, Typography } from '@mui/material';
import { CommentStatus } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseAssessmentById } from '../../api/assessments';
import { ReturnTypeFromUseOverallCommentsByYearGroup } from '../../api/overall-comment-year-group';
import { CommentStatusIcon } from './comment-status-icon';

interface OverallCommentsSummaryStatsProps {
  yearSummaryStats: Omit<
    ReturnTypeFromUseOverallCommentsByYearGroup,
    'students'
  >;
  assessmentData: ReturnTypeFromUseAssessmentById;
}

export function OverallCommentsSummaryStats({
  yearSummaryStats,
  assessmentData,
}: OverallCommentsSummaryStatsProps) {
  const { t } = useTranslation(['common', 'assessments']);

  const summarySettings = [
    assessmentData?.capturePrincipalComment && {
      amountEntered: yearSummaryStats?.principalCommentsEntered,
      label: 'assessments:principalCommentAmounts',
    },
    assessmentData?.captureYearHeadComment && {
      amountEntered: yearSummaryStats?.yearHeadCommentsEntered,
      label: 'assessments:yearHeadCommentAmounts',
    },
    assessmentData?.captureTutorComment && {
      amountEntered: yearSummaryStats?.tutorCommentsEntered,
      label: 'assessments:tutorCommentAmounts',
    },
  ].filter(Boolean) as {
    amountEntered: number | undefined;
    label:
      | 'assessments:principalCommentAmounts'
      | 'assessments:yearHeadCommentAmounts'
      | 'assessments:tutorCommentAmounts';
  }[];

  return (
    <Card
      variant="outlined"
      sx={{
        px: 1.5,
        borderRadius: 1,
      }}
    >
      <Typography variant="caption" color="slate.500">
        {t('common:summary')}
      </Typography>
      <Stack direction="row" spacing={3}>
        {summarySettings.map(({ amountEntered = 0, label }) => {
          let commentStatus = CommentStatus.NotStarted;

          if (amountEntered === yearSummaryStats.totalCommentsToEnter) {
            commentStatus = CommentStatus.Complete;
          } else if (amountEntered > 0) {
            commentStatus = CommentStatus.InProgress;
          }

          return (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CommentStatusIcon size="small" commentStatus={commentStatus} />
              <Typography variant="body2">
                {t(label, {
                  amountEntered,
                  totalToEnter: yearSummaryStats.totalCommentsToEnter,
                })}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
