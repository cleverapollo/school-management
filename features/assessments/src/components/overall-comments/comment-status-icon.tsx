import { Box } from '@mui/material';
import { CommentStatus } from '@tyro/api';
import { CheckmarkIcon } from '@tyro/icons';

const additionalCommentStatusStyles = {
  [CommentStatus.Complete]: {
    borderColor: 'success.main',
    backgroundColor: 'success.main',
  },
  [CommentStatus.InProgress]: {
    borderColor: 'warning.main',
  },
  [CommentStatus.NotStarted]: {
    borderColor: 'slate.300',
  },
};

export function CommentStatusIcon({
  commentStatus,
}: {
  commentStatus: CommentStatus;
}) {
  return (
    <Box
      sx={{
        borderRadius: '50%',
        width: 20,
        height: 20,
        border: '2px solid',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...additionalCommentStatusStyles[commentStatus],
      }}
    >
      {commentStatus === CommentStatus.Complete && (
        <CheckmarkIcon
          sx={{
            fontSize: '0.9rem',
            color: 'white',
            '& path': {
              strokeWidth: 3,
            },
          }}
        />
      )}
      {commentStatus === CommentStatus.InProgress && (
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor:
              additionalCommentStatusStyles[commentStatus].borderColor,
          }}
        />
      )}
    </Box>
  );
}
