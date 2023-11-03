import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { ReturnTypeFromUseSubjectGroupLessonByIterator } from '../../../api';

type LessonCardProps =
  Partial<ReturnTypeFromUseSubjectGroupLessonByIterator> & {
    onClick?: () => void;
  };

export const LessonCard = ({
  name = '-',
  startTime = '',
  endTime = '',
  colour,
  rooms = [],
  onClick,
}: LessonCardProps) => {
  const { t } = useTranslation(['common']);

  const startTimeFormat = dayjs(startTime).format('HH:mm');
  const endTimeFormat = dayjs(endTime).format('HH:mm');

  const content = (
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        gap: 3,
        p: 0.75,
        pr: 2,
        '&.MuiCardContent-root:last-child': {
          pb: 0.75,
        },
      }}
    >
      <Stack
        position="relative"
        pl={2}
        sx={({ palette }) => ({
          ':before': {
            content: '""',
            width: '5px',
            position: 'absolute',
            left: 0,
            height: '100%',
            borderRadius: 1.5,
            bgcolor: palette[colour || 'slate'][500],
          },
        })}
      >
        <Typography variant="subtitle1" component="span">
          {name}
        </Typography>
        <Typography variant="caption" component="span" color="text.secondary">
          {`${startTimeFormat} - ${endTimeFormat}`}
        </Typography>
      </Stack>
      <Stack textAlign="end">
        <Typography
          variant="caption"
          component="span"
          color="text.secondary"
          fontWeight={600}
        >
          {t('common:room', { count: rooms.length })}
        </Typography>
        <Typography variant="caption" component="span">
          {rooms.map((room) => room.name).join(', ') || '-'}
        </Typography>
      </Stack>
    </CardContent>
  );

  return (
    <Card
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        borderRadius: 1,
        boxShadow: '0px 2px 4px 0px rgba(165, 180, 252, 0.35)',
        borderTop: '1px solid',
        borderTopColor: 'slate.100',
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick}>{content}</CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};
