import { useMemo } from 'react';
import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { useDeleteCover } from '../../api/remove-cover';
import { ReturnTypeOfUseCoverTable } from '../../hooks/use-cover-table';

interface RemoveCoverModalProps {
  open: boolean;
  onClose: () => void;
  eventsMap: ReturnTypeOfUseCoverTable['selectedEventsMap'] | null;
}

export function RemoveCoverModal({
  open,
  onClose,
  eventsMap,
}: RemoveCoverModalProps) {
  const { t } = useTranslation(['substitution']);
  const { mutateAsync: deleteCover } = useDeleteCover();

  const { arrayOfDates, listOfDates } = useMemo(() => {
    const sortedDatesList = Array.from(eventsMap?.values() || [])
      .sort(
        (a, b) =>
          dayjs(a.event.startTime).date() - dayjs(b.event.startTime).date()
      )
      .map((a) => dayjs(a.event.startTime).format('L'));

    const datesArray = Array.from(new Set(sortedDatesList));

    return {
      arrayOfDates: datesArray,
      listOfDates: datesArray.join(', '),
    };
  }, [eventsMap]);

  const onConfirm = async () => {
    const substitutionIds = Array.from(eventsMap?.values() || [])
      .filter(({ substitution }) => substitution?.substitutionId)
      .map(({ substitution }) => substitution?.substitutionId) as number[];
    await deleteCover({ substitutionIds });
  };

  return (
    <ConfirmDialog
      open={open}
      title={t('substitution:removeCover')}
      description={t('substitution:youAreAboutToRemoveCover', {
        count: arrayOfDates.length,
        dates: listOfDates,
      })}
      confirmText={t('substitution:removeCover')}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
