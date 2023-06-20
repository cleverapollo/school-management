import { Box, Button, Menu, MenuItem, Stack } from '@mui/material';
import { SwapHorizontalIcon } from '@tyro/icons';
import { useState } from 'react';
import {
  ReturnTypeOfUseSwapTeacherAndRoom,
  SwapChange,
  SwapChangeWithOptionalLesson,
} from '../../../hooks/use-swap-teacher-and-room';

interface SwapChangeWithLabel extends SwapChange {
  label: string;
  isSelected: boolean;
}

interface SwapButtonProps {
  onClick:
    | ReturnTypeOfUseSwapTeacherAndRoom['swapTeacher']
    | ReturnTypeOfUseSwapTeacherAndRoom['swapRoom'];
  fromOptions: SwapChangeWithLabel[];
  to: SwapChangeWithOptionalLesson;
  isSwapped: boolean;
}

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
  fromOptions,
  to,
  isSwapped,
}: SwapButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const newLessonLabel = fromOptions[0].lesson?.partyGroup.name ?? '-';
  const originalLessonLabel = to.lesson?.partyGroup.name ?? '-';
  const showNewLabel = isSwapped || isFocused || isMenuOpen;
  const label = showNewLabel ? newLessonLabel : originalLessonLabel;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="text"
        size="small"
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={({ palette }) => ({
          justifyContent: 'flex-start',
          color: 'text.primary',
          fontWeight: 500,
          border: `1px solid ${
            isSwapped ? palette.primary.main : 'transparent'
          }`,
          backgroundColor: isSwapped ? `primary.lighter` : undefined,
        })}
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
      </Button>
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
