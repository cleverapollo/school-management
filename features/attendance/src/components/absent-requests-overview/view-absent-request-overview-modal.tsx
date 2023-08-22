import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  AttendanceCode,
  ParentalAttendanceRequestStatus,
  useUser,
} from '@tyro/api';
import {
  Avatar,
  ReturnTypeDisplayName,
  RHFSelect,
  RHFTextField,
  useDisclosure,
  usePreferredNameLayout,
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { WithdrawAbsentRequestConfirmModal } from './withdraw-absent-request-confirm-modal';
import { ReturnTypeFromUseAbsentRequests, useAttendanceCodes } from '../../api';
import { formatDateOfAbsence } from '../../utils/format-date-of-absence';

dayjs.extend(LocalizedFormat);

export type ViewAbsentRequestModalProps = {
  initialAbsentRequestState?: ReturnTypeFromUseAbsentRequests;
  onClose: () => void;
};

const getAbsentRequestDataWithLabels = (
  data: ReturnTypeFromUseAbsentRequests | undefined,
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  attendanceCodes: AttendanceCode[] | undefined
): CardEditableFormProps<ReturnTypeFromUseAbsentRequests>['fields'] => {
  if (data === undefined) return [];
  const { contact, attendanceCode, parentNote, requestType } = data;

  const contactName = displayName(contact?.person);
  const relationShip =
    Boolean(contact?.relationships?.length) &&
    contact?.relationships?.[0]?.relationshipType
      ? t(
          `common:relationshipType.${contact?.relationships?.[0]?.relationshipType}`
        )
      : '';

  return [
    {
      label: t('attendance:dateOfAbsence'),
      value: t(
        `attendance:absenceRequestFormatByType.${requestType}`,
        formatDateOfAbsence(data)
      ),
    },
    {
      label: t('common:createdBy'),
      value: contact,
      valueRenderer:
        [contactName, relationShip].filter(Boolean).join(', ') || '-',
    },
    {
      label: t('attendance:absenceType'),
      value: attendanceCode?.name,
      valueEditor: (
        <RHFSelect
          fullWidth
          options={(attendanceCodes ?? [])
            .filter(({ code }) => code !== undefined)
            .map(({ name }) => name)}
          getOptionLabel={(option) => option || ''}
          controlProps={{
            name: 'attendanceCode.code',
          }}
        />
      ),
    },
    {
      label: t('common:details'),
      value: parentNote,
      valueEditor: (
        <RHFTextField
          controlProps={{
            name: 'parentNote',
          }}
          textFieldProps={{
            fullWidth: true,
            multiline: true,
            minRows: 3,
          }}
        />
      ),
    },
  ];
};

export const ViewAbsentRequestModal = ({
  initialAbsentRequestState,
  onClose,
}: ViewAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);
  const { data: attendanceCodes } = useAttendanceCodes({});
  const { user } = useUser();

  const {
    isOpen: isWithdrawAbsentRequestsModalOpen,
    onOpen: onOpenWithdrawAbsentRequestsModal,
    onClose: onCloseWithdrawAbsentRequestsModal,
  } = useDisclosure();

  const { displayName } = usePreferredNameLayout();

  const absentRequestDataWithLabels = getAbsentRequestDataWithLabels(
    initialAbsentRequestState,
    t,
    displayName,
    attendanceCodes
  );

  return (
    <Dialog
      open={!!initialAbsentRequestState}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('attendance:viewAbsentRequest')}</DialogTitle>
      <DialogContent>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar
            name={displayName(initialAbsentRequestState?.student)}
            src={initialAbsentRequestState?.student?.avatarUrl}
          />
          <Stack>
            <Typography component="span" variant="subtitle2">
              {displayName(initialAbsentRequestState?.student)}
            </Typography>
            <Typography component="span" variant="body2">
              {initialAbsentRequestState?.classGroup?.name || '-'}
            </Typography>
          </Stack>
        </Stack>
        <Divider flexItem sx={{ mt: 3 }} />
        <CardEditableForm<ReturnTypeFromUseAbsentRequests>
          title={t('common:details')}
          editable={false}
          fields={absentRequestDataWithLabels}
          sx={{ mx: -3 }}
          hideBorder
          onSave={() => {}}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

        <Button
          variant="contained"
          onClick={onOpenWithdrawAbsentRequestsModal}
          color="primary"
          disabled={
            initialAbsentRequestState?.status !==
              ParentalAttendanceRequestStatus.Pending ||
            initialAbsentRequestState.contactPartyId !==
              user?.activeProfileId ||
            dayjs(initialAbsentRequestState.to).isAfter(dayjs())
          }
        >
          {t('attendance:withdrawAbsentRequest')}
        </Button>
      </DialogActions>
      {initialAbsentRequestState?.id && (
        <WithdrawAbsentRequestConfirmModal
          id={initialAbsentRequestState.id}
          isOpen={isWithdrawAbsentRequestsModalOpen}
          onClose={onCloseWithdrawAbsentRequestsModal}
        />
      )}
    </Dialog>
  );
};
