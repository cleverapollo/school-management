import { FieldValues } from 'react-hook-form';
import { usePreferredNameLayout } from '@tyro/core';
import { Box, Popover, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ReturnTypeFromUseBulkAttendance } from '../api/bulk-attendance/bulk-attendance';

interface AttendanceForCellProps {
  data: ReturnTypeFromUseBulkAttendance;
}
export const AttendanceForCell = <TField extends FieldValues>({
  data,
}: AttendanceForCellProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const { displayName } = usePreferredNameLayout();

  const attendanceForArr =
    data?.parties?.map((party) => {
      switch (party?.__typename) {
        case 'Student':
        case 'StudentContact':
        case 'Staff':
          return displayName(party?.person);
        case 'SubjectGroup':
          return party?.actualName;
        default:
          return party?.name ?? '-';
      }
    }) ?? [];

  const splittedArr =
    attendanceForArr
      .join('^')
      .slice(0, 31)
      .split('^')
      .filter((item) => item.replace('^', '')) ?? [];
  const showLastItem =
    splittedArr[splittedArr.length - 1] ===
    attendanceForArr[splittedArr.length - 1];
  const additionalItemsCount =
    attendanceForArr.length - splittedArr.length + (showLastItem ? 0 : 1);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Typography>{`${(showLastItem
          ? splittedArr
          : splittedArr.slice(0, -1)
        ).join(', ')}${
          additionalItemsCount ? ` +${additionalItemsCount}` : ''
        }`}</Typography>
      </Box>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
          // backgroundColor: theme.palette.common.white,
          boxShadow: theme.customShadows.card,
          color: theme.palette.text.primary,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {' '}
        {attendanceForArr
          .sort((nameA, nameB) => nameA.localeCompare(nameB))
          .map((name) => (
            <Stack direction="row" sx={{ p: 1 }}>
              <Typography variant="body2" color="text.primary" sx={{ px: 1 }}>
                {name ?? ''}
              </Typography>
            </Stack>
          ))}
      </Popover>
    </>
  );
};
