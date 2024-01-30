import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  getNumber,
  ActionMenu,
  ActionMenuProps,
  useDisclosure,
  ReturnTypeDisplayName,
} from '@tyro/core';

import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { Box, Fade } from '@mui/material';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  getPersonProfileLink,
  RecipientSearchType,
  SmsRecipientType,
} from '@tyro/api';
import { useMailSettings } from '@tyro/mail';
import { StudentTableAvatar } from '@tyro/people';
import {
  ReturnTypeFromUseOptionsPreferences,
  useOptionsPreferences,
} from '../../api/options-preferences';

const getStudentPreferenceColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseOptionsPreferences>['columnDefs'] => [
  {
    colId: 'student',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.student),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseOptionsPreferences, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student}
          to={getPersonProfileLink(data?.student)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    filter: true,
  },
];

export default function StudentOptionsPreferencesPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const [selectedStudents, setSelectedStudents] =
    useState<RecipientsForSmsModal>([]);
  const { sendMailToParties } = useMailSettings();
  const { displayName } = usePreferredNameLayout();
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const { data: preferences } = useOptionsPreferences({ optionId });

  const studentPreferenceColumns = useMemo(
    () => getStudentPreferenceColumns(t, displayName),
    [t, displayName]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
        hasAccess: ({ isStaffUserWithPermission }) =>
          isStaffUserWithPermission('ps:1:communications:send_sms'),
      },
      {
        label: t('mail:sendMail'),
        icon: <SendMailIcon />,
        hasAccess: ({ isStaffUserWithPermission }) =>
          isStaffUserWithPermission(
            'api:communications:read:search_recipients'
          ),
        onClick: () => {
          sendMailToParties(
            selectedStudents.map((student) => student.id),
            [
              {
                label: t('mail:contactsOfStudent', {
                  count: selectedStudents.length,
                }),
                type: RecipientSearchType.StudentContacts,
              },
            ]
          );
        },
      },
    ],
    [selectedStudents, sendMailToParties]
  );

  return (
    <>
      <Table
        rowData={preferences ?? []}
        columnDefs={studentPreferenceColumns}
        rowSelection="multiple"
        getRowId={({ data }) => JSON.stringify(data?.id)}
        rightAdornment={
          <Fade in={selectedStudents.length > 0} unmountOnExit>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
        onRowSelection={(students) =>
          setSelectedStudents(
            students.map(({ student }) => {
              const { partyId, avatarUrl } = student;
              return {
                id: partyId,
                name: displayName(student),
                type: 'individual',
                avatarUrl,
              };
            })
          )
        }
      />

      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedStudents}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudent', {
              count: selectedStudents.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
    </>
  );
}
