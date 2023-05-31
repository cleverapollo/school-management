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
import { SmsRecipientType, UseQueryReturnType } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { AddUserIcon, MobileIcon } from '@tyro/icons';
import { useStaff } from '../../api/staff';

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
    field: 'staffIreTeacher.teachingPost',
    headerName: t('people:post'),
  },
  {
    field: 'employmentCapacity',
    headerName: t('common:capacity'),
    valueGetter: ({ data }) =>
      data && data.employmentCapacity
        ? t(`people:employmentCapacity.${data.employmentCapacity}`)
        : t(`people:employmentCapacity.UNKNOWN`),
  },
  {
    field: 'carRegistrationNumber',
    headerName: t('people:carRegistration'),
  },
  {
    field: 'startDate',
    headerName: t('common:startDate'),
    valueGetter: ({ data }) =>
      data && data.startDate ? dayjs(data.startDate).format('ll') : '-',
  },
  {
    field: 'endDate',
    headerName: t('common:endDate'),
    valueGetter: ({ data }) =>
      data && data.endDate ? dayjs(data.endDate).format('ll') : '-',
  },
  {
    field: 'staffIre.pps',
    headerName: t('people:ppsNumber'),
  },
  {
    field: 'personalInformation.gender',
    headerName: t('people:gender.title'),
    valueGetter: ({ data }) =>
      data?.personalInformation?.gender
        ? t(`people:gender.${data?.personalInformation?.gender}`)
        : t('people:gender.UNKNOWN'),
  },
  {
    field: 'staffIreTeacher.teacherCouncilNumber',
    headerName: t('people:teacherCouncilNumber'),
  },
  {
    field: 'personalInformation.preferredFirstName',
    headerName: t('common:preferredFirstName'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: t('common:phone'),
    editable: true,
    hide: true,
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
];

export default function StaffListPage() {
  const { t } = useTranslation(['common', 'people']);
  const { data: staff } = useStaff({});
  const { displayName } = usePreferredNameLayout();
  const [selectedStaff, setSelectedStaff] = useState<RecipientsForSmsModal>([]);
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();
  const staffColumns = useMemo(
    () => getStaffColumns(t, displayName),
    [t, displayName]
  );

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
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
