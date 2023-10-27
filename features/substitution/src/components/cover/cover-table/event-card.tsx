import { useMemo, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { CoverEvent } from '../../../hooks/use-cover-table';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverCardTooltip } from './cover-card-tooltip';
import { EventCoverContextMenu } from './event-context-menu';
import {
  getCurrentCoverRoom,
  getAdditionalStaff,
  getEventId,
} from '../../../utils/cover-utils';
import {
  SubIconWithType,
  colorsBySubstitutionType,
} from './sub-icon-with-type';

interface EventCoverCardProps {
  eventInfo: CoverEvent;
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
  isEventSelected: (eventInfo: CoverEvent) => boolean;
  toggleEventSelection: (eventInfo: CoverEvent) => void;
  applyCover: (anchorEvent: CoverEvent) => void;
  editCover: (anchorEvent: CoverEvent) => void;
  removeCover: (anchorEvent: CoverEvent) => void;
  selectedEvents: CoverEvent[];
}

export function EventCoverCard({
  eventInfo,
  staff,
  isEventSelected,
  toggleEventSelection,
  applyCover,
  editCover,
  removeCover,
  selectedEvents,
}: EventCoverCardProps) {
  const { event, substitution } = eventInfo;
  const { displayName } = usePreferredNameLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isSelected = isEventSelected(eventInfo);
  const isContextMenuOpen = Boolean(anchorEl);
  const isCompact = useMediaQuery('(max-width: 1980px)');

  const rooms = getCurrentCoverRoom(eventInfo);

  const { substitutionType, substituteStaff } = substitution ?? {};
  const additionalTeachers = useMemo(
    () => getAdditionalStaff(eventInfo),
    [event?.attendees, staff, substituteStaff]
  );

  const color = substitutionType
    ? colorsBySubstitutionType[
        substitutionType.code as keyof typeof colorsBySubstitutionType
      ]
    : 'slate';
  const borderColor =
    isSelected || isContextMenuOpen ? `${color}.600` : 'white';

  return (
    <>
      <CoverCardTooltip
        timeslotInfo={{
          startTime: event.startTime,
          endTime: event.endTime,
        }}
        rooms={rooms}
        additionalTeachers={additionalTeachers}
      >
        <Box
          sx={{
            backgroundColor: `${color}.100`,
            borderRadius: 0.75,
            width: isCompact ? 80 : 120,
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
            if (
              !selectedEvents.find(
                (selectedEvent) =>
                  getEventId(selectedEvent) === getEventId(eventInfo)
              )
            ) {
              toggleEventSelection(eventInfo);
            }
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
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography variant="subtitle2" noWrap>
                  {event.name}
                </Typography>
                {substitutionType && (
                  <SubIconWithType substitutionType={substitutionType} />
                )}
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
                  {displayName(substituteStaff ?? staff)}
                  {additionalTeachers.length > 0
                    ? ` +${additionalTeachers.length}`
                    : ''}
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
        editCover={() => editCover(eventInfo)}
        removeCover={() => removeCover(eventInfo)}
        showEdit={
          selectedEvents.length === 1 && !!selectedEvents[0].substitution
        }
        showApply={selectedEvents.some(
          (selectedEvent) => !selectedEvent.substitution
        )}
        showRemove={selectedEvents.some(
          (selectedEvent) => !!selectedEvent.substitution
        )}
        isSelected={isSelected}
      />
    </>
  );
}
