import { useMemo, useState } from 'react';
import { Box, Container, Fade, Typography } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  ReturnTypeDisplayNames,
  useDisclosure,
  ActionMenu,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { MobileIcon, CalendarEditPenIcon, PrinterIcon } from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { getPersonProfileLink, SmsRecipientType } from '@tyro/api';
import dayjs from 'dayjs';
import {
  useBulkUpdateCoreStudent,
  ReturnTypeFromUseStudents,
  useStudents,
} from '../../api/student/students';
import { ChangeProgrammeYearModal } from '../../components/students/change-programme-year-modal';
import { StudentTableAvatar } from '../../components/common/student-table-avatar';
import {
  BulkPrintPersonsGroupsMembershipsModal
} from '../../components/common/bulk-print-persons-groups-memberships-modal';

const getStudentColumns = (
  translate: TFunction<
    ('common' | 'people')[],
    undefined,
    ('common' | 'people')[]
  >,
  displayName: ReturnTypeDisplayName,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseStudents>['columnDefs'] => [
  {
    field: 'person',
    headerName: translate('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudents, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={!!data?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
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
  {
    field: 'classGroup.name',
    headerName: translate('people:class'),
    enableRowGroup: true,
    filter: true,
  },
  {
    field: 'yearGroups',
    headerName: translate('common:year'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (data && data.yearGroups.length > 0) {
        return data.yearGroups[0].name;
      }
    },
    filter: true,
  },
  {
    field: 'tutors',
    headerName: translate('common:tutor'),
    enableRowGroup: true,
    valueGetter: ({ data }) => displayNames(data?.tutors),
  },
  {
    field: 'yearGroupLeads',
    headerName: translate('common:yearhead'),
    enableRowGroup: true,
    valueGetter: ({ data }) => displayNames(data?.yearGroupLeads),
    filter: true,
  },
  {
    field: 'programmeStages',
    headerName: translate('common:programme'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (data?.programmeStages && data.programmeStages.length > 0) {
        return data.programmeStages[0]?.programme?.name;
      }
    },
    filter: true,
  },
  {
    field: 'studentIrePP.examNumber',
    headerName: translate('people:personal.enrolmentHistory.examNumber'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.preferredFirstName',
    headerName: translate('common:preferredFirstName'),
    editable: true,
    hide: true,
  },
  {
    field: 'personalInformation.primaryPhoneNumber.number',
    headerName: translate('common:phone'),
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
    headerName: translate('common:email'),
    editable: true,
    hide: true,
    cellEditor: 'agEmailCellEditor',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'personalInformation.primaryEmail.email', newValue);
      return true;
    },
  },
  {
    field: 'personalInformation.dateOfBirth',
    headerName: translate('people:dateOfBirth'),
    hide: true,
    valueGetter: ({ data }) =>
      data?.personalInformation?.dateOfBirth
        ? dayjs(data.personalInformation.dateOfBirth).format('L')
        : undefined,
  },
  {
    field: 'studentIrePP.previousSchoolName',
    headerName: translate(
      'people:personal.enrolmentHistory.previousSchoolName'
    ),
    hide: true,
  },
  {
    field: 'partyId',
    headerName: translate('common:tyroId'),
    hide: true,
  },
];

export default function StudentsListPage() {
  const { t } = useTranslation(['common', 'people', 'sms']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const [selectedStudents, setSelectedStudents] =
    useState<RecipientsForSmsModal>([]);

  const { data: students } = useStudents();
  const { mutateAsync: bulkSaveStudents } = useBulkUpdateCoreStudent();

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

  const {
    isOpen: isChangeYearGroupOpen,
    onOpen: onOpenChangeYearGroup,
    onClose: onCloseChangeYearGroup,
  } = useDisclosure();

  const studentColumns = useMemo(
    () => getStudentColumns(t, displayName, displayNames),
    [t, displayName, displayNames]
  );

  return (
    <>
      <Page title={t('common:students')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('common:students')}
          </Typography>
          <Table
            rowData={students ?? []}
            columnDefs={studentColumns}
            rowSelection="multiple"
            getRowId={({ data }) => String(data?.partyId)}
            onBulkSave={bulkSaveStudents}
            statusBar={{
              statusPanels: [
                {
                  statusPanel: 'agTotalAndFilteredRowCountComponent',
                  align: 'left',
                },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
              ],
            }}
            rightAdornment={
              <Fade in={selectedStudents.length > 0} unmountOnExit>
                <Box>
                  <ActionMenu
                    menuItems={[
                      {
                        label: t('people:sendSms'),
                        icon: <MobileIcon />,
                        onClick: onOpenSendSms,
                        hasAccess: ({ isStaffUserWithPermission }) =>
                          isStaffUserWithPermission(
                            'ps:1:communications:send_sms'
                          ),
                      },
                      {
                        label: t('people:changeProgrammeYear'),
                        icon: <CalendarEditPenIcon />,
                        onClick: onOpenChangeYearGroup,
                        hasAccess: ({ isStaffUserWithPermission }) =>
                          isStaffUserWithPermission(
                            'ps:1:groups:edit_class_list_manager'
                          ),
                      },
                      {
                        label: t('people:printGroupMemberships'),
                        icon: <PrinterIcon />,
                        onClick: onOpenBulkPrint,
                      },
                    ]}
                  />
                </Box>
              </Fade>
            }
            onRowSelection={(newSelectedStudents) => {
              setSelectedStudents(
                newSelectedStudents.map((student) => {
                  const [programmeStage] = student.programmeStages || [];

                  return {
                    id: student.partyId,
                    name: displayName(student.person),
                    type: 'individual',
                    avatarUrl: student.person?.avatarUrl,
                    programmeStage,
                  };
                })
              );
            }}
          />
        </Container>
      </Page>
      <ChangeProgrammeYearModal
        isOpen={isChangeYearGroupOpen}
        onClose={onCloseChangeYearGroup}
        students={selectedStudents}
      />
      <BulkPrintPersonsGroupsMembershipsModal
        isOpen={isBulkPrintOpen}
        onClose={onCloseBulkPrint}
        groups={selectedStudents}
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
            type: SmsRecipientType.Student,
          },
          {
            label: t('sms:subjectTeachersOfStudent', {
              count: selectedStudents.length,
            }),
            type: SmsRecipientType.StudentTeachers,
          },
        ]}
      />
    </>
  );
}
