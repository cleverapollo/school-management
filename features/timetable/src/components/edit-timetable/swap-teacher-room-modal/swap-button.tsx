import { Box, Button } from '@mui/material';
import { SwapHorizontalIcon } from '@tyro/icons';
import { useState } from 'react';
import {
  ReturnTypeOfUseSwapTeacherAndRoom,
  SwapChange,
  SwapChangeWithOptionalLesson,
} from '../../../hooks/use-swap-teacher-and-room';

interface SwapChangeWithLabel extends SwapChange {
  label: string;
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
  const [isMouseOver, setIsMouseOver] = useState(false);
  const newLessonLabel = fromOptions[0].lesson?.partyGroup.name ?? '-';
  const originalLessonLabel = to.lesson?.partyGroup.name ?? '-';
  const showNewLabel = isSwapped || isMouseOver;
  const label = showNewLabel ? newLessonLabel : originalLessonLabel;

  return (
    <Button
      variant="text"
      size="small"
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      sx={({ palette }) => ({
        justifyContent: 'flex-start',
        color: 'text.primary',
        fontWeight: 500,
        border: `1px solid ${isSwapped ? palette.primary.main : 'transparent'}`,
        backgroundColor: isSwapped ? `primary.lighter` : undefined,
      })}
      endIcon={showNewLabel ? <SwapIcon /> : undefined}
      onClick={() =>
        onClick({
          from: {
            id: fromOptions[0].id,
            lesson: fromOptions[0].lesson,
          },
          to,
        })
      }
    >
      {label}
    </Button>
  );
}
