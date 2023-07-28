import { Box, Stack, Typography } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { useState } from 'react';
import { CoverEvent } from '../../../hooks/use-cover-table';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverCardTooltip } from './cover-card-tooltip';
import { EventCoverContextMenu } from './event-context-menu';
import { getCurrentCoverRoom } from '../../../utils/cover-utils';

interface EventCoverCardProps {
  eventInfo: CoverEvent;
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
  isEventSelected: (eventInfo: CoverEvent) => boolean;
  toggleEventSelection: (eventInfo: CoverEvent) => void;
  applyCover: (anchorEvent: CoverEvent) => void;
}

export function EventCoverCard({
  eventInfo,
  staff,
  isEventSelected,
  toggleEventSelection,
  applyCover,
}: EventCoverCardProps) {
  const { event, substitution } = eventInfo;
  const { displayName } = usePreferredNameLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isSelected = isEventSelected(eventInfo);
  const isContextMenuOpen = Boolean(anchorEl);

  const rooms = getCurrentCoverRoom(eventInfo);

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
            toggleEventSelection(eventInfo);
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
        applyCover={() => applyCover(eventInfo)}
        isSelected={isSelected}
      />
    </>
  );
}
