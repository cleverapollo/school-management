import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { ParentalAttendanceRequestType } from '@tyro/api';
import { ReturnTypeFromUseAbsentRequests } from '../api';

dayjs.extend(LocalizedFormat);

export const formatDateOfAbsence = ({
  from,
  to,
  requestType,
}: Pick<ReturnTypeFromUseAbsentRequests, 'requestType' | 'from' | 'to'>) => {
  const startDate = dayjs(from).format('L');
  const endDate = dayjs(to).format('L');

  const datesByType = {
    [ParentalAttendanceRequestType.SingleDay]: { startDate },
    [ParentalAttendanceRequestType.PartialDay]: {
      startDate,
      startTime: dayjs(from).format('LT'),
      endTime: dayjs(to).format('LT'),
    },
    [ParentalAttendanceRequestType.MultiDay]: { startDate, endDate },
  };

  return datesByType[requestType];
};
