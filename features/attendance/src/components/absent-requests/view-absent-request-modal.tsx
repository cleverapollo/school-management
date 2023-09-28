import { Button, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import { ParentalAttendanceRequestStatus } from '@tyro/api';
import {
  Avatar,
  ReturnTypeDisplayName,
  RHFSelect,
  RHFTextField,
  useDisclosure,
  useFormValidator,
  usePreferredNameLayout,
  CardEditableForm,
  CardEditableFormProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@tyro/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { LoadingButton } from '@mui/lab';
import { DeclineAbsentRequestConfirmModal } from './decline-absent-request-confirm-modal';
import { ApproveAbsentRequestConfirmModal } from './approve-absent-request-confirm-modal';
import {
  ReturnTypeFromUseAbsentRequests,
  useAttendanceCodes,
  useCreateOrUpdateAbsentRequest,
  ReturnTypeFromUseAttendanceCodes,
} from '../../api';
import { formatDateOfAbsence } from '../../utils/format-date-of-absence';
import { WithdrawAbsentRequestConfirmModal } from './withdraw-absent-request-confirm-modal';

dayjs.extend(LocalizedFormat);

export type ViewAbsentRequestModalProps = {
  initialAbsentRequestState?: ReturnTypeFromUseAbsentRequests;
  onClose: () => void;
  isContact?: boolean;
};

const getAbsentRequestDataWithLabels = (
  data: ReturnTypeFromUseAbsentRequests | undefined,
  t: TFunction<('common' | 'attendance')[]>,
  displayName: ReturnTypeDisplayName,
  attendanceCodes: ReturnTypeFromUseAttendanceCodes[] | undefined,
  isContact: boolean | undefined
): CardEditableFormProps<ReturnTypeFromUseAbsentRequests>['fields'] => {
  if (data === undefined) return [];
  const {
    contact,
    attendanceCode,
    parentNote,
    adminNote,
    requestType,
    status,
  } = data;

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
        `attendance:dayTypeOptionsFormatted.${requestType}`,
        formatDateOfAbsence(data)
      ),
    },
    {
      label: t('common:submittedBy'),
      value: contact,
      valueRenderer:
        [contactName, relationShip].filter(Boolean).join(', ') || '-',
    },
    {
      label: t('attendance:reasonForAbsence'),
      value: attendanceCode?.id,
      valueRenderer: [attendanceCode?.name, attendanceCode?.description]
        .filter(Boolean)
        .join(' - '),
      valueEditor: (
        <RHFSelect
          fullWidth
          optionIdKey="id"
          options={attendanceCodes ?? []}
          getOptionLabel={(option) => option.name || ''}
          controlProps={{
            name: 'attendanceCode.id',
          }}
        />
      ),
    },
    {
      label: t('common:note'),
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
    ...(isContact && status === ParentalAttendanceRequestStatus.Denied
      ? [
          {
            label: t('attendance:feedbackFromSchool'),
            value: adminNote || '-',
            valueEditor: (
              <RHFTextField
                controlProps={{
                  name: 'adminNote',
                }}
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  minRows: 3,
                }}
              />
            ),
          },
        ]
      : []),
  ];
};

export const ViewAbsentRequestModal = ({
  initialAbsentRequestState,
  onClose,
  isContact,
}: ViewAbsentRequestModalProps) => {
  const { t } = useTranslation(['common', 'attendance']);

  const { data: attendanceCodes } = useAttendanceCodes({
    visibleForContacts: isContact,
  });

  const { mutate: createOrUpdateAbsentRequestMutation, isLoading } =
    useCreateOrUpdateAbsentRequest();

  const {
    isOpen: isApproveAbsentRequestModalOpen,
    onOpen: onOpenApproveAbsentRequestModal,
    onClose: onCloseApproveAbsentRequestModal,
  } = useDisclosure();

  const {
    isOpen: isDeclineAbsentRequestModalOpen,
    onOpen: onOpenDeclineAbsentRequestModal,
    onClose: onCloseDeclineAbsentRequestModal,
  } = useDisclosure();

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
    attendanceCodes,
    isContact
  );
  const { resolver, rules } =
    useFormValidator<ReturnTypeFromUseAbsentRequests>();

  const absentRequestFormResolver = resolver({
    attendanceCode: rules.required(),
  });

  const handleEdit = (
    { attendanceCode, parentNote }: ReturnTypeFromUseAbsentRequests,
    onSuccess: () => void
  ) => {
    if (initialAbsentRequestState) {
      createOrUpdateAbsentRequestMutation(
        [
          {
            ...initialAbsentRequestState,
            id: initialAbsentRequestState.id,
            attendanceCodeId:
              attendanceCode?.id ??
              initialAbsentRequestState?.attendanceCode?.id,
            parentNote,
          },
        ],
        { onSuccess }
      );
    }
  };

  const isBeforeAbsentDate = dayjs().isBefore(
    dayjs(initialAbsentRequestState?.from)
  );

  const disableWithdraw =
    initialAbsentRequestState?.status !==
      ParentalAttendanceRequestStatus.Pending || !isBeforeAbsentDate;

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
            isContact
              ? initialAbsentRequestState?.status ===
                  ParentalAttendanceRequestStatus.Pending && isBeforeAbsentDate
              : true
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
          {isContact ? t('common:actions.close') : t('common:actions.cancel')}
        </Button>
        {isContact ? (
          <Tooltip
            describeChild
            title={disableWithdraw ? t('attendance:unableToWithdraw') : ''}
          >
            <span>
              <LoadingButton
                variant="contained"
                onClick={onOpenWithdrawAbsentRequestsModal}
                color="primary"
                disabled={disableWithdraw}
                loading={isLoading}
                sx={{ ml: 2 }}
              >
                {t('attendance:withdrawAbsentRequest')}
              </LoadingButton>
            </span>
          </Tooltip>
        ) : (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onOpenDeclineAbsentRequestModal}
              disabled={
                initialAbsentRequestState?.status ===
                ParentalAttendanceRequestStatus.Denied
              }
            >
              {t('common:actions.decline')}
            </Button>
            <Button
              variant="contained"
              onClick={onOpenApproveAbsentRequestModal}
              color="primary"
              disabled={
                initialAbsentRequestState?.status ===
                ParentalAttendanceRequestStatus.Approved
              }
            >
              {t('common:actions.approve')}
            </Button>
          </>
        )}
      </DialogActions>
      {isContact ? (
        initialAbsentRequestState?.id && (
          <WithdrawAbsentRequestConfirmModal
            id={initialAbsentRequestState.id}
            isOpen={isWithdrawAbsentRequestsModalOpen}
            onWithdraw={onClose}
            onClose={onCloseWithdrawAbsentRequestsModal}
          />
        )
      ) : (
        <>
          <ApproveAbsentRequestConfirmModal
            isOpen={isApproveAbsentRequestModalOpen}
            onClose={onCloseApproveAbsentRequestModal}
            onApprove={onClose}
            absentRequestState={
              initialAbsentRequestState ? [initialAbsentRequestState] : []
            }
          />
          <DeclineAbsentRequestConfirmModal
            isOpen={isDeclineAbsentRequestModalOpen}
            onClose={onCloseDeclineAbsentRequestModal}
            onDecline={onClose}
            absentRequestState={
              initialAbsentRequestState ? [initialAbsentRequestState] : []
            }
          />
        </>
      )}
    </Dialog>
  );
};
