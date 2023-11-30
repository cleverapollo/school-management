import { useMemo, useState } from 'react';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';

import {
  GridOptions,
  ICellRendererParams,
  Table,
  ReturnTypeDisplayName,
  TablePersonAvatar,
  usePreferredNameLayout,
  useDisclosure,
  ActionMenu,
  PageContainer,
  PageHeading,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import {
  PermissionUtils,
  SearchType,
  SmsRecipientType,
  UseQueryReturnType,
  UserPermission,
} from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import {
  AddUserIcon,
  MobileIcon,
  PrinterIcon,
  SendMailIcon,
} from '@tyro/icons';
import { useMailSettings } from '@tyro/mail';
import { useStaff } from '../../api/staff';
import { BulkPrintPersonsGroupsMembershipsModal } from '../../components/common/bulk-print-persons-groups-memberships-modal';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseStudents = UseQueryReturnType<typeof useStaff>[number];

const getStaffColumns = (
  t: TFunction<('common' | 'people')[], undefined, ('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseStudents>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudents, any>) =>
      data ? (
        <TablePersonAvatar
          person={data?.person}
          to={`./${data?.partyId ?? ''}`}
        />
      ) : null,
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
  },
  {
    field: 'position',
    headerName: t('people:position'),
    valueGetter: ({ data }) => data?.position || '-',
  },
  {
    field: 'employmentCapacity.name',
    headerName: t('common:capacity'),
    valueGetter: ({ data }) => data?.employmentCapacity?.name || '-',
  },
  {
    field: 'staffIre.staffPost.name',
    headerName: t('people:post'),
    valueGetter: ({ data }) => data?.staffIre?.staffPost?.name || '-',
  },
  {
    field: 'startDate',
    headerName: t('common:startDate'),
    valueGetter: ({ data }) =>
      data && data.startDate ? dayjs(data.startDate).format('ll') : '-',
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: t('common:phone'),
    editable: true,
    cellEditor: 'agNumericCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(
        data ?? {},
        'personalInformation.primaryPhoneNumber.number',
        newValue
      );
      return true;
    },
  },
  {
    field: 'personalInformation.primaryEmail.email',
    headerName: t('common:email'),
    editable: true,
    hide: true,
    cellEditor: 'agEmailCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'personalInformation.primaryEmail.email', newValue);
      return true;
    },
  },
  {
    field: 'personalInformation.gender',
    headerName: t('people:gender.title'),
    valueGetter: ({ data }) =>
      data?.personalInformation?.gender
        ? t(`people:gender.${data?.personalInformation?.gender}`)
        : t('people:gender.UNKNOWN'),
    hide: true,
  },
  {
    field: 'carRegistrationNumber',
    headerName: t('people:carRegistration'),
    hide: true,
  },
  {
    field: 'parking',
    headerName: t('people:parkingLocation'),
    hide: true,
  },
  {
    field: 'personalInformation.ire.ppsNumber',
    headerName: t('people:ppsNumber'),
    hide: true,
  },
  {
    field: 'staffIre.teacherCouncilNumber',
    headerName: t('people:teacherCouncilNumber'),
    hide: true,
  },
  {
    field: 'endDate',
    headerName: t('common:endDate'),
    hide: true,
    valueGetter: ({ data }) =>
      data && data.endDate ? dayjs(data.endDate).format('ll') : '-',
  },
];

export default function StaffListPage() {
  const { t } = useTranslation(['common', 'people', 'mail']);
  const { data: staff } = useStaff({});
  const { displayName } = usePreferredNameLayout();
  const [selectedStaff, setSelectedStaff] = useState<RecipientsForSmsModal>([]);

  const { composeEmail } = useMailSettings();

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const {
    isOpen: isBulkPrintOpen,
    onOpen: onOpenBulkPrint,
    onClose: onCloseBulkPrint,
  } = useDisclosure();

  const staffColumns = useMemo(
    () => getStaffColumns(t, displayName),
    [t, displayName]
  );

  const sendMailToSelectedStaff = () => {
    const staffListForMail = selectedStaff.map(({ id, name, avatarUrl }) => ({
      partyId: id,
      type: SearchType.Staff,
      text: name,
      avatarUrl,
    }));

    composeEmail({
      canReply: false,
      bccRecipients: staffListForMail,
    });
  };

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
    },
    {
      label: t('mail:sendMail'),
      icon: <SendMailIcon />,
      onClick: sendMailToSelectedStaff,
    },
    {
      label: t('people:printGroupMemberships'),
      icon: <PrinterIcon />,
      onClick: onOpenBulkPrint,
      hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
        isStaffUserWithPermission(
          'ps:1:printing_and_exporting:print_staff_group_memberships'
        ),
    },
  ];

  return (
    <>
      <PageContainer title={t('people:pageTitle.staff')}>
        <PageHeading
          title={t('people:pageHeading.staff')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                component={Link}
                to="./create"
                startIcon={<AddUserIcon />}
              >
                {t('people:createStaff')}
              </Button>
            </Box>
          }
        />
        <Table
          rowData={staff ?? []}
          columnDefs={staffColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
          onBulkSave={async () => {}}
          rightAdornment={
            <Fade in={selectedStaff.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onRowSelection={(newSelectedStaff) =>
            setSelectedStaff(
              newSelectedStaff.map(({ partyId, person }) => ({
                id: partyId,
                name: displayName(person),
                type: 'individual',
                avatarUrl: person?.avatarUrl,
              }))
            )
          }
        />
      </PageContainer>
      <BulkPrintPersonsGroupsMembershipsModal
        isOpen={isBulkPrintOpen}
        onClose={onCloseBulkPrint}
        groups={selectedStaff}
      />
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedStaff}
        hideRecipientTypes
        possibleRecipientTypes={[
          {
            label: '',
            type: SmsRecipientType.Staff,
          },
        ]}
      />
    </>
  );
}
