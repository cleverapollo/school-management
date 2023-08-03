import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  AttendanceCode,
  GeneralGroup,
  ParentalAttendanceRequest,
  ParentalAttendanceRequestStatus,
  Person,
  StudentContactRelationshipInfo,
} from '@tyro/api';
import React from 'react';
import {
  Avatar,
  DisplayNamePersonProps,
  PreferredNameFormat,
  RHFSelect,
  RHFTextField,
  useDisclosure,
  useFormValidator,
  usePreferredNameLayout,
} from '@tyro/core';
import dayjs from 'dayjs';
import {
  CardEditableForm,
  CardEditableFormProps,
} from '@tyro/people/src/components/common/card-editable-form';
import { DeclineAbsentRequestConfirmModal } from '../decline-absent-request-confirm-modal';
import { ApproveAbsentRequestConfirmModal } from '../approve-absent-request-confirm-modal';
import {
  getAbsentRequests,
  useAttendanceCodes,
  useCreateOrUpdateAbsentRequest,
} from '../../api';

export type ViewAbsentRequestFormState = Pick<
  ParentalAttendanceRequest,
  | 'adminNote'
  | 'attendanceCodeId'
  | 'contactPartyId'
  | 'createdOn'
  | 'from'
  | 'id'
  | 'parentNote'
  | 'requestType'
  | 'status'
  | 'studentPartyId'
  | 'to'
> & {
  classGroup?: Pick<GeneralGroup, 'name'> | null;
  contact?: {
    person: Omit<Person, 'partyId'>;
    relationships?:
      | (Pick<
          StudentContactRelationshipInfo,
          'relationshipType' | 'studentPartyId'
        > | null)[]
      | null;
  } | null;
  student?: Omit<Person, 'partyId'> | null;
  attendanceCode: Pick<AttendanceCode, 'code' | 'name' | 'id'>;
};

export type ViewAbsentRequestModalProps = {
  initialAbsentRequestState?: ViewAbsentRequestFormState | undefined;
  onClose: () => void;
};

const getAbsentRequestDataWithLabels = (
  data: ViewAbsentRequestFormState | undefined,
  t: TFunction<('common' | 'attendance')[]>,
  displayName: (
    person: DisplayNamePersonProps,
    options?: {
      format: PreferredNameFormat;
    }
  ) => string,
  attendanceCodes: AttendanceCode[] | undefined
): CardEditableFormProps<ViewAbsentRequestFormState>['fields'] => {
  const { from, contact, attendanceCode, parentNote } = data || {};

  return [
    {
      label: t('attendance:dateOfAbsence'),
      value: dayjs(from).format('D MMMM YYYY'),
    },
    {
      label: t('common:createdBy'),
      value: contact,
      valueRenderer:
        `${displayName(contact?.person, {
          format: PreferredNameFormat.FirstnameSurname,
        })}, ${
          contact?.relationships?.length &&
          contact?.relationships?.[0]?.relationshipType
            ? t(
                `common:relationshipType.${contact?.relationships?.[0]?.relationshipType}`
              )
            : ''
        }` ?? '-',
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
  const { resolver, rules } = useFormValidator<ViewAbsentRequestFormState>();

  const absentRequestFormResolver = resolver({
    attendanceCode: rules.required(),
  });

  const handleEdit = ({
    attendanceCode,
    parentNote,
  }: ViewAbsentRequestFormState) => {
    if (initialAbsentRequestState) {
      createOrUpdateAbsentRequestMutation([
        {
          attendanceCodeId:
            attendanceCode?.id ?? initialAbsentRequestState?.attendanceCode?.id,
          parentNote,
          adminNote: initialAbsentRequestState?.adminNote,
          from: initialAbsentRequestState?.from,
          id: initialAbsentRequestState?.id,
          requestType: initialAbsentRequestState?.requestType,
          status: initialAbsentRequestState?.status,
          studentPartyId: initialAbsentRequestState?.studentPartyId,
          to: initialAbsentRequestState?.to,
        },
      ]);

      getAbsentRequests({});
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
      <Stack direction="row" gap={2} px={3} pb={3} pt={1} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar
            name={displayName(initialAbsentRequestState?.student)}
            src={initialAbsentRequestState?.student?.avatarUrl}
          />
        </Box>
        <Stack>
          <Typography component="span" variant="subtitle2">
            {displayName(initialAbsentRequestState?.student)}
          </Typography>
          <Typography component="span" variant="body2" sx={{ flex: 1 }}>
            {initialAbsentRequestState?.classGroup?.name ?? '-'}
          </Typography>
        </Stack>
      </Stack>
      <Divider flexItem sx={{ mx: 3 }} />

      <CardEditableForm
        title={t('common:details')}
        editable
        fields={absentRequestDataWithLabels}
        resolver={absentRequestFormResolver}
        onSave={handleEdit}
        sx={{
          border: 'none',
          '.MuiCardHeader-root': { borderBottom: 'none !important' },
        }}
      />
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

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
          color="success"
          onClick={onOpenApproveAbsentRequestModal}
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
        initialAbsentRequestState={initialAbsentRequestState}
      />
      <DeclineAbsentRequestConfirmModal
        isOpen={isDeclineAbsentRequestModalOpen}
        onClose={onCloseDeclineAbsentRequestModal}
        onDecline={onClose}
        initialAbsentRequestState={initialAbsentRequestState}
      />
    </Dialog>
  );
};
