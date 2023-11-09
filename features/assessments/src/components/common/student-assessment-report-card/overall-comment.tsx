import {
  Button,
  CircularProgress,
  FilledInput,
  FormLabel,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import {
  AssessmentCommentBank,
  CommenterUserType,
  CommentType,
  useUser,
} from '@tyro/api';
import { CloseIcon, EditIcon } from '@tyro/icons';
import { useDisclosure, VisuallyHidden } from '@tyro/core';
import { RefObject, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import { LoadingButton } from '@mui/lab';
import { useCommentBanksWithComments } from '../../../api/comment-bank';
import { useUpdateAssessmentComment } from '../../../api/term-assessments/assessment-comments';
import { useStudentAssessmentReportCardSettings } from './settings';

interface CommentPopoverProps {
  buttonId: string;
  open: boolean;
  onClose: () => void;
  anchorEl: RefObject<HTMLButtonElement>;
  value: string | number | null | undefined;
  onSave: (value: string | number | null | undefined) => void;
  commentType: CommentType | null | undefined;
  commentBank: AssessmentCommentBank | null | undefined;
  commentLength: number | null | undefined;
  isSubmitting?: boolean;
}

interface OverallCommentProps {
  commentId: number | null | undefined;
  commenterUserType: Exclude<CommenterUserType, CommenterUserType.Teacher>;
  comment: string | null | undefined;
  canEdit: boolean;
  value: string | number | null | undefined;
  commentType: CommentType | null | undefined;
  commentBank: AssessmentCommentBank | null | undefined;
  commentLength: number | null | undefined;
  isSubmitting?: boolean;
}

const editableStyles = {
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'indigo.50',
  },
  '&:active': {
    backgroundColor: 'indigo.200',
  },
  '& svg': {
    color: 'primary.main',
    '& path': {
      strokeWidth: 1.8,
    },
  },
  '&:hover, &:active': {
    '& dt': {
      color: 'primary.dark',
    },

    '& svg': {
      color: 'primary.main',
    },
  },
};

function CommentPopover({
  buttonId,
  open,
  onClose,
  anchorEl,
  value,
  onSave,
  commentType,
  commentBank,
  commentLength,
  isSubmitting,
}: CommentPopoverProps) {
  const freeFormInputId = useId();
  const { t } = useTranslation(['common', 'assessments']);
  const [freeFormComment, setFreeFormComment] = useState<string>('');

  const isCommentBank = commentType === CommentType.CommentBank;
  const { data: commentBankComments } = useCommentBanksWithComments(
    {
      ids: [commentBank?.commentBankId ?? 0],
    },
    isCommentBank
  );

  const comments = useMemo(() => {
    if (!Array.isArray(commentBankComments) || commentBankComments.length <= 0)
      return [];

    return (
      commentBankComments[0].comments?.filter(({ active }) => active) ?? []
    );
  }, [commentBankComments]);

  useEffect(() => {
    if (open) {
      setFreeFormComment((value ?? '') as string);
    }
  }, [value, open]);

  if (isCommentBank) {
    return (
      <Menu
        anchorEl={anchorEl.current}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': buttonId,
          role: 'listbox',
        }}
      >
        {comments?.map(({ id, comment }) => (
          <MenuItem
            key={id}
            selected={value === id}
            sx={{ justifyContent: 'space-between' }}
            onClick={() => onSave(id)}
          >
            {comment}

            {value === id && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(null);
                }}
                aria-label={t('common:actions.deselect')}
                color="primary"
                sx={{
                  p: 0,
                  ml: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </MenuItem>
        ))}
      </Menu>
    );
  }

  return (
    <Popover
      id={buttonId}
      open={open}
      anchorEl={anchorEl.current}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            minWidth: {
              xs: 'auto',
              sm: 400,
            },
          },
        },
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <VisuallyHidden>
        <FormLabel htmlFor={freeFormInputId}>
          {t('assessments:enterComment')}
        </FormLabel>
      </VisuallyHidden>
      <FilledInput
        id={freeFormInputId}
        autoFocus
        hiddenLabel
        fullWidth
        placeholder={t('assessments:enterComment')}
        multiline
        minRows={2}
        onFocus={(e) =>
          e.target.setSelectionRange(
            freeFormComment.length,
            freeFormComment.length
          )
        }
        value={freeFormComment}
        onChange={(e) => setFreeFormComment(e.target.value)}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        mt={2}
      >
        <Typography variant="caption" component="span">
          {freeFormComment.length}/{commentLength}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Button size="small" variant="soft" color="inherit" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>
          <LoadingButton
            size="small"
            variant="contained"
            onClick={() => onSave(freeFormComment.trim() || null)}
            loading={isSubmitting}
          >
            {t('common:actions.save')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Popover>
  );
}

export function OverallComment({
  commentId,
  commenterUserType,
  comment,
  canEdit,
  value,
  ...commentSettings
}: OverallCommentProps) {
  const { t } = useTranslation(['common']);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { id, isOpen, onOpen, onClose } = useDisclosure();
  const { academicNamespaceId, assessmentId, studentPartyId } =
    useStudentAssessmentReportCardSettings();
  const { activeProfile } = useUser();

  const commenterLabel = {
    [CommenterUserType.Principal]: t('common:principal'),
    [CommenterUserType.YearHead]: t('common:yearHead'),
    [CommenterUserType.Tutor]: t('common:tutor'),
    [CommenterUserType.HouseMaster]: t('common:houseMaster'),
  };

  const { mutateAsync: saveComment, isLoading: isSubmitting } =
    useUpdateAssessmentComment(academicNamespaceId);

  const onSave = async (newValue: string | number | null | undefined) => {
    if (commentSettings.commentType === CommentType.CommentBank) {
      onClose();
    }

    await saveComment(
      [
        {
          id: commentId,
          assessmentId,
          studentPartyId,
          commenterUserType,
          commenterPartyId: activeProfile?.partyId ?? 0,
          ...(commentSettings.commentType === CommentType.CommentBank
            ? { commentBankCommentId: newValue as number, comment: null }
            : { comment: newValue as string, commentBankCommentId: null }),
        },
      ],
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const getHasPopupAria = () => {
    if (!canEdit) return undefined;

    return commentSettings.commentType === CommentType.CommentBank
      ? 'listbox'
      : 'dialog';
  };

  return (
    <>
      <Stack
        ref={anchorRef}
        id={id}
        component={canEdit ? 'button' : 'div'}
        aria-haspopup={getHasPopupAria()}
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={
          canEdit
            ? () => {
                onOpen();
              }
            : undefined
        }
        width={{
          xs: 'calc(100% - 16px)',
          sm: 'calc(50% - 16px)',
          md: 'calc(33.3% - 16px)',
        }}
        p={1}
        m={1}
        sx={{
          border: 0,
          backgroundColor: 'transparent',
          borderRadius: 1,
          ...(canEdit ? editableStyles : {}),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={isSubmitting ? 1 : 0.5}
        >
          <Typography variant="subtitle2" component="dt">
            {commenterLabel[commenterUserType]}
          </Typography>
          {canEdit && !isSubmitting && (
            <EditIcon sx={{ width: 20, height: 20 }} />
          )}
          {isSubmitting && <CircularProgress size={16} />}
        </Stack>
        <Typography variant="body2" component="dd" textAlign="left">
          {comment ?? '-'}
        </Typography>
      </Stack>
      {canEdit && (
        <CommentPopover
          buttonId={id}
          anchorEl={anchorRef}
          onSave={onSave}
          open={isOpen}
          onClose={onClose}
          value={value}
          {...commentSettings}
        />
      )}
    </>
  );
}
