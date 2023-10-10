import { Box, Chip, Stack, StackProps, Typography } from '@mui/material';
import { NotebookIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import dayjs from 'dayjs';
import { ReturnTypeFromUseNotes } from '../../../../api/note/list';

type NTKNoteContainerProps = StackProps;

export function NTKNoteContainer({
  children,
  sx,
  ...props
}: NTKNoteContainerProps) {
  const { t } = useTranslation(['people']);

  return (
    <Stack
      {...props}
      sx={{
        backgroundColor: 'slate.100',
        borderRadius: 4,
        p: 2,
        mt: 1.5,
        ...sx,
      }}
    >
      <Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: 'inline-flex',
            backgroundColor: 'indigo.200',
            color: 'indigo.600',
            border: '2px solid',
            borderColor: 'indigo.500',
            alignItems: 'center',
            px: 1,
            py: 0.5,
            borderRadius: 5,
          }}
        >
          <NotebookIcon />
          <Typography variant="h6" component="h3">
            {t('people:notes')}
          </Typography>
        </Stack>
      </Box>
      <Stack>{children}</Stack>
    </Stack>
  );
}

interface KTKNoteProps {
  note: ReturnTypeFromUseNotes;
}

export function KTKNote({
  note: { priorityStartDate, priorityEndDate, note, tags },
}: KTKNoteProps) {
  const title =
    priorityStartDate && priorityEndDate
      ? `${dayjs(priorityStartDate).format('D MMM')} - ${dayjs(
          priorityEndDate
        ).format('D MMM')}`
      : null;

  return (
    <Stack
      sx={{
        border: '1px solid',
        borderColor: 'background.neutral',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: 1,
        mt: 1,
      }}
    >
      {title && (
        <Typography variant="subtitle1" component="h4">
          {title}
        </Typography>
      )}
      <Typography variant="body1">{note}</Typography>
      {tags.length > 0 && (
        <Stack direction="row" gap={1} mt={0.5} flexWrap="wrap">
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              variant="soft"
              color={getColorBasedOnIndex(tag.id)}
              size="small"
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
