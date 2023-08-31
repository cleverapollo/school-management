import { useMemo, useState } from 'react';
import { Box, Container, Fade, Typography } from '@mui/material';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TablePersonAvatar,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  ReturnTypeDisplayNames,
  useDisclosure,
  ActionMenu,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { MobileIcon, CalendarEditPenIcon } from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { SmsRecipientType } from '@tyro/api';
import {
  useBulkUpdateCoreStudent,
  ReturnTypeFromUseStudents,
  useStudents,
} from '../../api/student/students';
import { ChangeProgrammeYearModal } from '../../components/students/change-programme-year-modal';

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
    field: 'classGroup.name',
    headerName: translate('people:class'),
    enableRowGroup: true,
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
    field: 'studentIrePP.previousSchoolName',
    headerName: translate(
      'people:personal.enrolmentHistory.previousSchoolName'
    ),
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
