import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { onLongPress, usePreferredNameLayout } from '@tyro/core';
import { LayersIcon } from '@tyro/icons';
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
  isContextMenuOpen: boolean;
  onOpenContextMenu: () => void;
  onCloseContextMenu: () => void;
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
  isContextMenuOpen,
  onOpenContextMenu,
  onCloseContextMenu,
}: EventCoverCardProps) {
  const { event, substitution } = eventInfo;
  const [clickableContainerRef, setClickableContainerRef] =
    useState<HTMLDivElement | null>(null);
  const { displayName } = usePreferredNameLayout();
  const isSelected = isEventSelected(eventInfo);

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

  const openContextMenu = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (
      selectedEvents.every(
        (selectedEvent) => getEventId(selectedEvent) !== getEventId(eventInfo)
      )
    ) {
      toggleEventSelection(eventInfo);
    }
    onOpenContextMenu();
  };

  return (
    <>
      <CoverCardTooltip staff={staff} eventInfo={eventInfo}>
        <Box
          ref={(ref: HTMLDivElement) => setClickableContainerRef(ref)}
          className="event-cover-card"
          sx={{
            backgroundColor: `${color}.100`,
            borderRadius: 0.75,
            width: '100%',
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
          onContextMenu={openContextMenu}
          {...onLongPress<HTMLDivElement>(openContextMenu)}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'stretch', height: '100%', p: 0.75, pr: 1.25 }}
          >
            {eventInfo?.coverTeacherDuplicatedAtSameTime &&
              eventInfo.coverTeacherDuplicatedAtSameTime.length > 0 && (
                <Stack mr={1} alignItems="center" alignSelf="center">
                  <LayersIcon sx={{ width: 20, height: 20 }} />
                  <Typography
                    variant="caption"
                    fontWeight="semibold"
                    noWrap
                    sx={{ flex: 1 }}
                  >
                    {eventInfo.coverTeacherDuplicatedAtSameTime.length + 1}
                  </Typography>
                </Stack>
              )}
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
              {rooms && (
                <Typography
                  className="cover-rooms-for-print"
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ flex: 1, display: 'none' }}
                >
                  {rooms}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </CoverCardTooltip>
      <EventCoverContextMenu
        anchorEl={clickableContainerRef}
        open={Boolean(isContextMenuOpen && clickableContainerRef)}
        staff={staff}
        eventInfo={eventInfo}
        onClose={onCloseContextMenu}
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
