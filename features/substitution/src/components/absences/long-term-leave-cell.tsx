import { TableLinearProgress, usePreferredNameLayout } from '@tyro/core';
import { Box, Popover, Stack, Typography, useTheme } from '@mui/material';
import { useId, useMemo, useState } from 'react';
import { sortBy } from 'lodash';
import { CheckmarkIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseStaffWorkAbsences } from '../../api/staff-work-absences';

interface LongTermLeaveCellProps {
  absence: ReturnTypeFromUseStaffWorkAbsences;
}
export const LongTermLeaveCell = ({ absence }: LongTermLeaveCellProps) => {
  const popoverId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const { displayName } = usePreferredNameLayout();
  const { t } = useTranslation(['substitution']);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const sortedAbsence = useMemo(
    () => sortBy(absence.longTermLeaveGroups, 'group.name'),
    [absence]
  );

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        aria-owns={open ? popoverId : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <TableLinearProgress
          value={absence.longTermLeaveGroupsApplied}
          total={absence.longTermLeaveGroupsRequired}
        />
      </Box>
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
        {sortedAbsence.map((group) => (
          <Stack key={group.groupId} direction="row" sx={{ p: 1 }}>
            <Typography variant="body2" color="text.primary" sx={{ px: 1 }}>
              {group.group?.name ?? ''}:
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {group.coveringStaff?.person
                ? displayName(group.coveringStaff?.person)
                : t('substitution:noCover')}
            </Typography>
            {group.coveringStaff && (
              <CheckmarkIcon
                sx={{
                  mx: 1,
                  width: 18,
                  height: 18,
                  mt: 0.4,
                  color: 'green.500',
                  '& path': {
                    strokeWidth: 2,
                  },
                }}
              />
            )}
          </Stack>
        ))}
      </Popover>
    </>
  );
};
