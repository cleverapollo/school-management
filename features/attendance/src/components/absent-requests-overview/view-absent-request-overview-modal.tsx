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
import { ParentalAttendanceRequestStatus } from '@tyro/api';
import {
  Avatar,
  CardEditableForm,
  CardEditableFormProps,
  RHFSelect,
  RHFTextField,
  ReturnTypeDisplayName,
  useDisclosure,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { LoadingButton } from '@mui/lab';
import {
  ReturnTypeFromUseAbsentRequests,
  ReturnTypeFromUseAttendanceCodes,
  useAttendanceCodes,
  useCreateOrUpdateAbsentRequest,
} from '../../api';
import { formatDateOfAbsence } from '../../utils/format-date-of-absence';
import { WithdrawAbsentRequestConfirmModal } from './withdraw-absent-request-confirm-modal';

dayjs.extend(LocalizedFormat);

export type ViewAbsentRequestModalProps = {
  initialAbsentRequestState?: ReturnTypeFromUseAbsentRequests;
  onClose: () => void;
};

const getAbsentRequestDataWithLabels = (
  data: ReturnTypeFromUseAbsentRequests | undefined,
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[] | undefined
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
        <RHFSelect<ReturnTypeFromUseAbsentRequests, string>
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
  const { data: attendanceCodes = [] } = useAttendanceCodes({});

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

  const { resolver, rules } =
    useFormValidator<ReturnTypeFromUseAbsentRequests>();

  const absentRequestFormResolver = resolver({
    attendanceCode: rules.required(),
  });

  const { mutate, isLoading } = useCreateOrUpdateAbsentRequest();

  const handleEdit = ({
    attendanceCode,
    parentNote,
  }: ReturnTypeFromUseAbsentRequests) => {
    if (initialAbsentRequestState) {
      mutate([
        {
          id: initialAbsentRequestState.id,
          from: initialAbsentRequestState.from,
          to: initialAbsentRequestState.to,
          requestType: initialAbsentRequestState.requestType,
          status: initialAbsentRequestState.status,
          studentPartyId: initialAbsentRequestState.studentPartyId,
          attendanceCodeId:
            attendanceCode?.id ?? initialAbsentRequestState?.attendanceCode?.id,
          parentNote,
        },
      ]);
    }
  };

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
        <CardEditableForm
          title={t('common:details')}
          editable={
            initialAbsentRequestState?.status ===
              ParentalAttendanceRequestStatus.Pending ||
            dayjs().isBefore(dayjs(initialAbsentRequestState?.from))
          }
          fields={absentRequestDataWithLabels}
          resolver={absentRequestFormResolver}
          onSave={handleEdit}
          sx={{ mx: -3 }}
          hideBorder
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          onClick={onOpenWithdrawAbsentRequestsModal}
          color="primary"
          disabled={
            initialAbsentRequestState?.status !==
              ParentalAttendanceRequestStatus.Pending ||
            dayjs().isAfter(dayjs(initialAbsentRequestState.from))
          }
          loading={isLoading}
        >
          {t('attendance:withdrawAbsentRequest')}
        </LoadingButton>
      </DialogActions>
      {initialAbsentRequestState?.id && (
        <WithdrawAbsentRequestConfirmModal
          id={initialAbsentRequestState.id}
          isOpen={isWithdrawAbsentRequestsModalOpen}
          onWithdraw={onClose}
          onClose={onCloseWithdrawAbsentRequestsModal}
        />
      )}
    </Dialog>
  );
};
