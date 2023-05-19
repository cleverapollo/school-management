import { useParams } from 'react-router-dom';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  TableBooleanValue,
  TableAvatar,
  useNumber,
  ActionMenu,
} from '@tyro/core';
import { Box, Fade } from '@mui/material';
import { useMemo, useState } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { MobileIcon, PersonHeartIcon, SendMailIcon } from '@tyro/icons';
import { useContactStudents } from '../../../api';
import { ConfirmUnlinkModal } from '../../../components/contact/confirm-unlink-modal';

type ReturnTypeFromUseContactStudents = UseQueryReturnType<
  typeof useContactStudents
>[number];

const getContactStudentsColumns = (
  t: TFunction<('people' | 'common')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseContactStudents>['columnDefs'] => [
  {
    field: 'student.person',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents>) => {
      if (!data) return null;
      const student = data?.student;
      return (
        <TableAvatar
          name={displayName(student?.person) ?? ''}
          to={`/people/students/${student?.partyId ?? ''}`}
          avatarUrl={student?.person?.avatarUrl}
        />
      );
    },
    sort: 'asc',
  },
  {
    field: 'student.classGroup.name',
    headerName: t('common:class'),
    filter: true,
    enableRowGroup: true,
  },
  {
    field: 'relationshipType',
    headerName: t('common:relationship'),
    valueGetter: ({ data }) => {
      const contactsRelationshipType = data?.relationshipType;
      return contactsRelationshipType
        ? t(`common:relationshipType.${contactsRelationshipType}`)
        : '';
    },
  },
  {
    field: 'priority',
    headerName: t('people:priority'),
  },
  {
    field: 'legalGuardian',
    headerName: t('people:legalGuardian'),
    valueGetter: ({ data }) =>
      data?.legalGuardian ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => (
      <TableBooleanValue value={Boolean(data?.legalGuardian)} />
    ),
  },
  {
    field: 'pickupRights',
    headerName: t('people:pickupPermission'),
    valueGetter: ({ data }) =>
      data?.pickupRights ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => (
      <TableBooleanValue value={Boolean(data?.pickupRights)} />
    ),
  },
  {
    field: 'allowAccessToStudentData',
    headerName: t('people:allowAccessToStudentData'),
    valueGetter: ({ data }) =>
      data?.allowAccessToStudentData ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => (
      <TableBooleanValue value={Boolean(data?.allowAccessToStudentData)} />
    ),
  },
  {
    field: 'includeInSms',
    headerName: t('people:includeInSms'),
    valueGetter: ({ data }) =>
      data?.includeInSms ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => (
      <TableBooleanValue value={Boolean(data?.includeInSms)} />
    ),
  },
  {
    field: 'includeInTmail',
    headerName: t('people:includeInTmail'),
    valueGetter: ({ data }) =>
      data?.includeInTmail ? t('common:yes') : t('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => (
      <TableBooleanValue value={Boolean(data?.includeInTmail)} />
    ),
  },
];

export default function ContactProfileStudentsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { displayName } = usePreferredNameLayout();
  const [selectedContacts, setSelectedContacts] = useState<
    ReturnTypeFromUseContactStudents[]
  >([]);
  const [isShowAlertUnlink, setIsShowAlertUnlink] = useState<boolean>(false);
  const { data: contactStudentsData } = useContactStudents(idNumber);

  const contactStudentColumns = useMemo(
    () => getContactStudentsColumns(t, displayName),
    [t, displayName]
  );

  const actionMenuItems = useMemo(
    () => [
      [
        {
          label: t('people:sendSms'),
          icon: <MobileIcon />,
          onClick: () => {},
        },
        {
          label: t('mail:sendMail'),
          icon: <SendMailIcon />,
          onClick: () => {},
        },
      ],
      [
        {
          label: t('people:unlinkStudent'),
          icon: <PersonHeartIcon />,
          onClick: () => {
            setIsShowAlertUnlink(true);
          },
          disabled: selectedContacts.length !== 1,
          disabledTooltip: t('people:unlinkStudent'),
        },
      ],
    ],
    [selectedContacts]
  );

  return (
    <>
      <Table
        rowData={contactStudentsData ?? []}
        columnDefs={contactStudentColumns}
        getRowId={({ data }) => String(data?.studentPartyId)}
        rowSelection="multiple"
        onRowSelection={(rows) => {
          setSelectedContacts(rows);
        }}
        rightAdornment={
          <Fade in={selectedContacts.length > 0}>
            <Box>
              <ActionMenu
                menuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                }}
                menuItems={actionMenuItems}
              />
            </Box>
          </Fade>
        }
      />
      <ConfirmUnlinkModal
        isOpen={isShowAlertUnlink}
        onClose={() => setIsShowAlertUnlink(false)}
      />
    </>
  );
}
