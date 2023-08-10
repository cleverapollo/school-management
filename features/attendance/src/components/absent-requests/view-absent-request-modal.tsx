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
import { AttendanceCode, ParentalAttendanceRequestStatus } from '@tyro/api';
import React from 'react';
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
} from '@tyro/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { DeclineAbsentRequestConfirmModal } from './decline-absent-request-confirm-modal';
import { ApproveAbsentRequestConfirmModal } from './approve-absent-request-confirm-modal';
import {
  ReturnTypeFromUseAbsentRequests,
  useAttendanceCodes,
  useCreateOrUpdateAbsentRequest,
} from '../../api';

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
  const { from, contact, attendanceCode, parentNote } = data || {};

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
      value: from,
      valueRenderer: dayjs(from).format('LL'),
    },
    {
      label: t('common:createdBy'),
      value: contact,
      valueRenderer: `${contactName}, ${relationShip}`,
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

  const { mutate: createOrUpdateAbsentRequestMutation } =
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

  const handleEdit = ({
    attendanceCode,
    parentNote,
  }: ReturnTypeFromUseAbsentRequests) => {
    if (initialAbsentRequestState) {
      createOrUpdateAbsentRequestMutation([
        {
          ...initialAbsentRequestState,
          attendanceCodeId:
            attendanceCode?.id ?? initialAbsentRequestState?.attendanceCode?.id,
          parentNote,
        },
      ]);

      onClose();
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
          editable
          fields={absentRequestDataWithLabels}
          resolver={absentRequestFormResolver}
          onSave={handleEdit}
          hideBorder
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

        <Button
          variant="contained"
          onClick={onOpenDeclineAbsentRequestModal}
          color="error"
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
      </DialogActions>
      <ApproveAbsentRequestConfirmModal
        isOpen={isApproveAbsentRequestModalOpen}
        onClose={onCloseApproveAbsentRequestModal}
        onApprove={onClose}
        absentRequestState={
          initialAbsentRequestState === undefined
            ? []
            : [initialAbsentRequestState]
        }
      />
      <DeclineAbsentRequestConfirmModal
        isOpen={isDeclineAbsentRequestModalOpen}
        onClose={onCloseDeclineAbsentRequestModal}
        onDecline={onClose}
        absentRequestState={
          initialAbsentRequestState === undefined
            ? []
            : [initialAbsentRequestState]
        }
      />
    </Dialog>
  );
};
