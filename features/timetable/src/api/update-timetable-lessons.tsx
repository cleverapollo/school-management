import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  TtEditLessonPeriodInstanceWrapper,
} from '@tyro/api';

import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

// const updateTimetableLessons = graphql(/* GraphQL */ `
//   mutation tt_editLessonInstance($input: TTEditLessonPeriodInstanceWrapper!) {
//     tt_editLessonInstance(input: $input) {
//       id {
//         timetableId
//         lessonIdx
//         lessonInstanceIdx
//         timetableGroupId
//       }
//       partyGroup {
//         name
//         partyId
//       }
//       gridIdx
//       dayIdx
//       periodIdx
//       roomId
//       room {
//         name
//         roomId
//         capacity
//       }
//       teacherIds
//       teachers {
//         partyId
//         person {
//           firstName
//           lastName
//         }
//       }
//       spread
//     }
//   }
// `);

export function useUpdateTimetableLessons() {
  const { t } = useTranslation(['common', 'settings']);
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: TtEditLessonPeriodInstanceWrapper) => {
      console.log({ input });
      return Promise.resolve();
    },
    // gqlClient.request(updateTimetableLessons, {
    //   input,
    // }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'));
    },
  });
}
