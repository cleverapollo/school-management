import { PreferredNameFormat, usePreferredNameLayout } from '@tyro/core';
import { Box, Popover, Stack, Typography, useTheme } from '@mui/material';
import { useId, useState } from 'react';
import { ReturnTypeFromUseBulkAttendance } from '../api/bulk-attendance/bulk-attendance';

interface AttendanceForCellProps {
  data: ReturnTypeFromUseBulkAttendance;
}

const NAME_MAX_LENGTH = 2;

export const AttendanceForCell = ({ data }: AttendanceForCellProps) => {
  const popoverId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const { displayName } = usePreferredNameLayout();

  const partyNames =
    data?.parties
      ?.map((party) => {
        switch (party?.__typename) {
          case 'Student':
          case 'StudentContact':
          case 'Staff':
            return displayName(party?.person, {
              format: PreferredNameFormat.FirstnameSurname,
            });
          case 'SubjectGroup':
            return party?.actualName;
          default:
            return party?.name ?? '-';
        }
      })
      .sort((nameA, nameB) => nameA.localeCompare(nameB)) ?? [];
  const isOverMaxLength = partyNames.length > NAME_MAX_LENGTH;

  const shortName = isOverMaxLength
    ? `${partyNames.slice(0, NAME_MAX_LENGTH).join(', ')} +${
        partyNames.length - NAME_MAX_LENGTH
      }`
    : partyNames.join(', ');

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = isOverMaxLength && Boolean(anchorEl);

  return (
    <>
      <Box
        component="span"
        aria-owns={open ? popoverId : undefined}
        aria-haspopup={isOverMaxLength}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {shortName}
      </Box>
      {isOverMaxLength && (
        <Popover
          id={popoverId}
          sx={{
            pointerEvents: 'none',
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
          <Stack sx={{ p: 1 }}>
            {partyNames.map((name) => (
              <Typography key={name} variant="body2" sx={{ px: 1 }}>
                {name ?? ''}
              </Typography>
            ))}
          </Stack>
        </Popover>
      )}
    </>
  );
};
