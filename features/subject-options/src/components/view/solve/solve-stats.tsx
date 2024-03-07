import {
  Typography,
  Card,
  Stack,
  Box,
  CircularProgress,
  CircularProgressProps,
  Divider,
  Chip,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { PinIcon } from '@tyro/icons';
import { StudentRow } from '../../../utils/get-student-rows';
import { ReturnTypeFromUseOptionsSolutions } from '../../../api/options-solutions';

interface SolveStatsProps {
  studentRows: StudentRow[];
  optionsSolutions: ReturnTypeFromUseOptionsSolutions | undefined;
}

function PercentFigure({
  value,
  label,
  total,
  color,
}: {
  value: number;
  label: string;
  total: number;
  color: Exclude<CircularProgressProps['color'], undefined | 'inherit'>;
}) {
  const { t } = useTranslation(['subjectOptions']);
  const percentage = Math.round((value / total) * 100);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          color={color}
          sx={(theme) => ({
            '&': {
              position: 'absolute',
              color: theme.palette[color].lighter,
            },
          })}
          value={100}
          size={60}
        />
        <CircularProgress
          variant="determinate"
          color={color}
          value={percentage}
          size={60}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${percentage}%`}</Typography>
        </Box>
      </Box>
      <Stack>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 24 / 14 }}
        >
          {t('subjectOptions:xOfyStudents', { x: value, y: total })}
        </Typography>
      </Stack>
    </Stack>
  );
}

export function SolveStats({ studentRows, optionsSolutions }: SolveStatsProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const totalStudents = useMemo(() => studentRows?.length ?? 0, [studentRows]);
  const totalWithPreferences = useMemo(
    () => studentRows?.filter((student) => student.hasPreferences).length ?? 0,
    [studentRows]
  );
  const totalWithReserveSubjects = useMemo(
    () =>
      studentRows?.filter((student) => student.hasReservedSubject).length ?? 0,
    [studentRows]
  );
  const totalHaveAllAssignedSubjectSlots = useMemo(
    () =>
      studentRows?.filter((student) => !student.missingOneSubject).length ?? 0,
    [studentRows]
  );

  const subjectGroups = useMemo(
    () =>
      optionsSolutions?.pools?.flatMap((pool) =>
        pool.blocks.flatMap((block) => block.subjectGroups)
      ) ?? [],
    [optionsSolutions]
  );

  return (
    <Card>
      <Stack direction="row" p={2} spacing={3} alignItems="center">
        <PercentFigure
          value={totalHaveAllAssignedSubjectSlots}
          label={t('subjectOptions:subjectsAllocated')}
          total={totalStudents}
          color="success"
        />
        <PercentFigure
          value={totalWithPreferences}
          label={t('subjectOptions:preferencesFulfilled')}
          total={totalStudents}
          color="info"
        />
        <PercentFigure
          value={totalWithReserveSubjects}
          label={t('subjectOptions:reservesUsed')}
          total={totalStudents}
          color="warning"
        />
        <Divider orientation="vertical" flexItem />
        <Stack flex={1}>
          <Typography variant="subtitle2">
            {t('subjectOptions:subjectBlocks')}
          </Typography>
          {subjectGroups.length > 0 ? (
            <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
              {subjectGroups.map(({ id, blockIdx, name, pinned }) => {
                const blockColor = getColorBasedOnIndex(blockIdx);
                return (
                  <Chip
                    key={id}
                    variant="soft"
                    label={name}
                    color={blockColor}
                    size="small"
                    sx={({ palette }) => ({
                      '& .MuiChip-deleteIcon': {
                        color: `${blockColor}.700`,
                        pointerEvents: 'none',

                        '&:hover': {
                          color: `${blockColor}.700`,
                        },
                      },
                      '& path:first-of-type': {
                        fill: palette[blockColor][700],
                      },
                    })}
                    onDelete={pinned ? () => {} : undefined}
                    deleteIcon={<PinIcon />}
                  />
                );
              })}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 24 / 14 }}
            >
              -
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
