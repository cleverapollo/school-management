import { Box, Stack, Typography } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { useState } from 'react';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverCardTooltip } from './cover-card-tooltip';
import { EventCoverContextMenu } from './event-context-menu';

type SubstitutionEvent =
  ReturnTypeFromUseEventsForCover[number]['substitutionEventsByDay'][number]['substitutionEventsByPeriod'][number];

interface EventCoverCardProps {
  event: SubstitutionEvent['event'];
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
  substitution: SubstitutionEvent['substitution'];
  isEventSelected: (event: SubstitutionEvent['event']) => boolean;
  toggleEventSelection: (
    event: React.MouseEvent,
    subEvent: SubstitutionEvent['event']
  ) => void;
  onOpenReplaceTeacher: (anchorEvent: SubstitutionEvent['event']) => void;
  onOpenSwapRoom: (anchorEvent: SubstitutionEvent['event']) => void;
}

export function EventCoverCard({
  event,
  staff,
  substitution,
  isEventSelected,
  toggleEventSelection,
  onOpenReplaceTeacher,
  onOpenSwapRoom,
}: EventCoverCardProps) {
  const { displayName } = usePreferredNameLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isSelected = isEventSelected(event);
  const isContextMenuOpen = Boolean(anchorEl);

  const rooms = (event.rooms ?? []).map(({ name }) => name).join(', ');

  const needsSubstitution = Boolean(substitution);

  const opacity = !needsSubstitution ? 1 : 0.2;
  const color = !needsSubstitution && event.colour ? event.colour : 'slate';
  const borderColor =
    isSelected || isContextMenuOpen ? `${color}.600` : 'white';

  return (
    <>
      <CoverCardTooltip
        timeslotInfo={{
          startTime: event.startTime,
          endTime: event.endTime,
        }}
      >
        <Box
          sx={{
            backgroundColor: `${color}.100`,
            opacity,
            borderRadius: 0.75,
            width: 240,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms',
            transitionProperty: 'background-color, opacity',
            border: '2px solid',
            borderColor,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            toggleEventSelection(e, event);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setAnchorEl(e.currentTarget);
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'stretch', height: '100%', p: 0.75, pr: 1.25 }}
          >
            <Box
              sx={{
                width: 3,
                borderRadius: 1.5,
                backgroundColor: `${color}.main`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDuration: '150ms',
                transitionProperty: 'background-color',
                mr: 0.75,
              }}
            />
            <Stack sx={{ overflow: 'hidden', flex: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                  {event.name}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  {rooms}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ flex: 1 }}
                >
                  {displayName(staff)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </CoverCardTooltip>
      <EventCoverContextMenu
        anchorEl={anchorEl}
        open={isContextMenuOpen}
        onClose={() => setAnchorEl(null)}
        onOpenReplaceTeacher={() => onOpenReplaceTeacher(event)}
        onOpenSwapRoom={() => onOpenSwapRoom(event)}
        isSelected={isSelected}
      />
    </>
  );
}
