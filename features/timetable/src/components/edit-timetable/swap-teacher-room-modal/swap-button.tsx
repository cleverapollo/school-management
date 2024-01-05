import { Box, Button, Menu, MenuItem, Stack, styled } from '@mui/material';
import { SwapHorizontalIcon } from '@tyro/icons';
import { FocusEventHandler, useState } from 'react';
import {
  ReturnTypeOfUseSwapTeacherAndRoom,
  SwapChange,
  SwapChangeWithOptionalLesson,
} from '../../../hooks/use-swap-teacher-and-room-modal';

interface SwapChangeWithLabel extends SwapChange {
  label: string;
  isSelected: boolean;
}

interface StyledSwapButtonProps {
  isSwapped: boolean;
}

interface SwapButtonProps extends StyledSwapButtonProps {
  onClick:
    | ReturnTypeOfUseSwapTeacherAndRoom['swapTeacher']
    | ReturnTypeOfUseSwapTeacherAndRoom['swapRoom'];
  onFocus?: FocusEventHandler<HTMLButtonElement> | undefined;
  fromOptions: SwapChangeWithLabel[];
  to: SwapChangeWithOptionalLesson;
}

interface UndoSwapButtonProps extends StyledSwapButtonProps {
  onClick: () => void;
  newLesson: SwapChangeWithOptionalLesson['lesson'] | undefined;
  originalLesson: SwapChangeWithOptionalLesson['lesson'] | undefined;
}

const StyledSwapButton = styled(Button)<StyledSwapButtonProps>(
  ({ theme: { palette }, isSwapped }) => ({
    justifyContent: 'flex-start',
    color: palette.text.primary,
    fontWeight: 500,
    border: `1px solid ${isSwapped ? palette.primary.main : 'transparent'}`,
    backgroundColor: isSwapped ? palette.primary.lighter : undefined,
    '&:disabled': {
      color: palette.text.primary,
    },
  })
);

StyledSwapButton.defaultProps = {
  variant: 'text',
  size: 'small',
};

function SwapIcon() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        borderRadius: '50%',
        backgroundColor: 'success.main',
      }}
    >
      <SwapHorizontalIcon
        sx={{
          transform: 'rotate(-45deg)',
          width: 14,
          height: 14,
          color: 'white',
          '& path': {
            strokeWidth: 2.5,
          },
        }}
      />
    </Box>
  );
}

export function SwapButton({
  onClick,
  onFocus,
  fromOptions,
  to,
  isSwapped,
}: SwapButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const newLessonLabel = fromOptions[0].lesson?.partyGroup?.name ?? '-';
  const originalLessonLabel = to.lesson?.partyGroup?.name ?? '-';
  const showNewLabel = isSwapped || isFocused || isMenuOpen;
  const label = showNewLabel ? newLessonLabel : originalLessonLabel;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledSwapButton
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        onFocus={(...args) => {
          setIsFocused(true);
          if (onFocus) {
            onFocus(...args);
          }
        }}
        onBlur={() => setIsFocused(false)}
        isSwapped={isSwapped}
        endIcon={showNewLabel ? <SwapIcon /> : undefined}
        onClick={() => {
          if (fromOptions.length === 1) {
            onClick({
              from: {
                id: fromOptions[0].id,
                lesson: fromOptions[0].lesson,
              },
              to,
            });
            return;
          }
          setAnchorEl(document.activeElement as HTMLElement);
        }}
      >
        {label}
      </StyledSwapButton>
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableAutoFocusItem
      >
        {fromOptions.map((fromOption) => (
          <MenuItem
            key={fromOption.id}
            dense
            selected={fromOption.isSelected}
            onClick={() => {
              onClick({
                from: {
                  id: fromOption.id,
                  lesson: fromOption.lesson,
                },
                to,
              });
              setIsFocused(false);
              handleClose();
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <span>{fromOption.label}</span>
              {fromOption.isSelected && <SwapIcon />}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export function UndoSwapButton({
  isSwapped,
  newLesson,
  originalLesson,
  ...props
}: UndoSwapButtonProps) {
  const label = isSwapped
    ? newLesson?.partyGroup?.name
    : originalLesson?.partyGroup?.name;

  return (
    <StyledSwapButton
      {...props}
      isSwapped={isSwapped}
      disabled={!isSwapped}
      endIcon={isSwapped ? <SwapIcon /> : undefined}
    >
      {label || '-'}
    </StyledSwapButton>
  );
}
