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
  size = 'medium',
}: {
  commentStatus: CommentStatus;
  size?: 'small' | 'medium';
}) {
  return (
    <Box
      sx={{
        borderRadius: '50%',
        width: size === 'small' ? 16 : 20,
        height: size === 'small' ? 16 : 20,
        border: '2px solid',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        ...additionalCommentStatusStyles[commentStatus],
      }}
    >
      {commentStatus === CommentStatus.Complete && (
        <CheckmarkIcon
          sx={{
            fontSize: size === 'small' ? '0.7rem' : '0.9rem',
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
            width: size === 'small' ? 8 : 10,
            height: size === 'small' ? 8 : 10,
            borderRadius: '50%',
            backgroundColor:
              additionalCommentStatusStyles[commentStatus].borderColor,
          }}
        />
      )}
    </Box>
  );
}
