import { useMutation, useQuery } from '@tanstack/react-query';

import {
  CreateCalendarEventsInput,
  FindFreeResourcesFilter,
  gqlClient,
  queryClient,
  graphql,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { calendarKeys } from './keys';

const roomLocation = graphql(/* GraphQL */ `
  query calendar_findFreeResources($filter: FindFreeResourcesFilter) {
    calendar_findFreeResources(filter: $filter) {
      freeRooms {
        roomId
        name
      }
      clashingRooms {
        room {
          roomId
          name
        }
      }
    }
  }
`);

const createEvents = graphql(/* GraphQL */ `
  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!) {
    calendar_createCalendarEvents(input: $input) {
      eventId
    }
  }
`);

const roomLocationQuery = (filter: FindFreeResourcesFilter) => ({
  queryKey: calendarKeys.roomLocation(filter),
  queryFn: () => gqlClient.request(roomLocation, { filter }),
});

export function useRoomLocation(filter: FindFreeResourcesFilter) {
  return useQuery({
    ...roomLocationQuery(filter),
    select: ({ calendar_findFreeResources }) => calendar_findFreeResources,
    enabled: !!filter.recurrence,
  });
}

export function useCreateCalendarEvent() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: calendarKeys.createEvent(),
    mutationFn: async (input: CreateCalendarEventsInput) =>
      gqlClient.request(createEvents, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.createSuccess'));
      queryClient.invalidateQueries(calendarKeys.all);
    },
  });
}
