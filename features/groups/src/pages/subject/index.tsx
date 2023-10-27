import { Box, Fade, Container, Typography } from '@mui/material';
import {
  PermissionUtils,
  SmsRecipientType,
  SubjectGroupType,
  UpdateSubjectGroupInput,
} from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Page,
  Table,
  ICellRendererParams,
  ActionMenu,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  BulkEditedRows,
  TableAvatar,
  useDisclosure,
  sortStartNumberFirst,
  ConfirmDialog,
} from '@tyro/core';

import { MobileIcon, MoveGroupIcon } from '@tyro/icons';

import set from 'lodash/set';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { SubjectSelectCellEditor } from '@tyro/core/src/components/table/cell-editors/subject';
import { CatalogueSubjectOption, useCatalogueSubjects } from '@tyro/settings';
import {
  useSaveSubjectGroupEdits,
  useSubjectGroups,
  useSwitchSubjectGroupType,
} from '../../api/subject-groups';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<('common' | 'groups')[]>,
  displayNames: ReturnTypeDisplayNames,
  subjects?: CatalogueSubjectOption[]
): GridOptions<ReturnTypeFromUseSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups>) => {
      if (!data) return null;

      const subject = data?.subjects?.[0];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
    comparator: sortStartNumberFirst,
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    editable: true,
    valueSetter: ({ data, newValue }) => {
      const newOption = subjects?.find(({ id }) => id === newValue);

      set(data, 'subjects[0]', newOption ?? {});
      return true;
    },
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    cellEditorSelector: () => SubjectSelectCellEditor(subjects),
    enableRowGroup: true,
  },
  {
    field: 'studentMembers.memberCount',
    headerName: t('common:members'),
    sortable: true,
  },
  {
    colId: 'year',
    headerName: t('common:year'),
    filter: true,
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.yearGroups?.map((year) => year?.name).join(', '),
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <TableStudyLevelChip level={data.irePP.level} />
      ) : null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
  {
    colId: 'studentGroupType',
    headerName: t('groups:groupType'),
    enableRowGroup: true,
    hide: true,
    valueGetter: ({ data }) =>
      data?.studentMembershipType?.type
        ? t(
            `groups:subjectGroupStudentMembershipType.${data.studentMembershipType.type}`
          )
        : t('groups:subjectGroupStudentMembershipType.UNKNOWN'),
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const { data: subjectGroupsData } = useSubjectGroups();
  const { data: subjects } = useCatalogueSubjects();
  const { mutateAsync: updateSubjectGroup } = useSaveSubjectGroupEdits();
  const { mutateAsync: switchSubjectGroupType } = useSwitchSubjectGroupType();
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();
  const [switchGroupTypeConfirmation, setSwitchGroupTypeConfirmation] =
    useState(false);

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames, subjects),
    [t, displayNames, subjects]
  );

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
      hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
        isStaffUserWithPermission('ps:1:communications:send_sms'),
    },
    {
      label: t('groups:subjectGroup.switchToSupportClass.action'),
      icon: <MoveGroupIcon />,
      onClick: () => setSwitchGroupTypeConfirmation(true),
      hasAccess: ({ isTyroUser }: PermissionUtils) => isTyroUser,
    },
    // {
    //   label: t('mail:sendMail'),
    //   icon: <SendMailIcon />,
    //   onClick: () => {},
    // },
  ];

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseSubjectGroups,
      'irePP.level' | 'name' | 'subjects'
    >
  ) => {
    const updates = Object.entries(data).reduce<UpdateSubjectGroupInput[]>(
      (acc, [partyId, changes]) => {
        const level = changes['irePP.level'];
        const { name } = changes;
        const { subjects: subjectsChange } = changes;
        const updatedEntry: UpdateSubjectGroupInput = {
          subjectGroupPartyId: Number(partyId),
        };

        if (level) {
          updatedEntry.irePP = { level: level.newValue };
        }
        if (name) {
          updatedEntry.name = name.newValue;
        }
        if (subjectsChange && subjectsChange.newValue.length) {
          updatedEntry.subjectIds = [subjectsChange.newValue[0]?.id];
        }

        acc.push(updatedEntry);
        return acc;
      },
      []
    );

    return updateSubjectGroup(updates);
  };

  return (
    <>
      <Page title={t('groups:subjectGroups')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('groups:subjectGroups')}
          </Typography>
          <Table
            rowData={subjectGroupsData ?? []}
            columnDefs={studentColumns}
            rowSelection="multiple"
            getRowId={({ data }) => String(data?.partyId)}
            onBulkSave={handleBulkSave}
            rightAdornment={
              <Fade in={selectedGroups.length > 0} unmountOnExit>
                <Box>
                  <ActionMenu menuItems={actionMenuItems} />
                </Box>
              </Fade>
            }
            onRowSelection={(groups) =>
              setSelectedGroups(
                groups.map(({ partyId, name, avatarUrl, subjects }) => {
                  const subject = subjects?.[0];
                  return {
                    id: partyId,
                    name,
                    type: 'group',
                    avatarUrl,
                    avatarColor: subject?.colour,
                  };
                })
              )
            }
          />
        </Container>
      </Page>

      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudentMembers', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupContact,
          },
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
      <ConfirmDialog
        open={!!switchGroupTypeConfirmation}
        title={t('groups:subjectGroup.switchToSupportClass.modalTitle')}
        description={t(
          'groups:subjectGroup.switchToSupportClass.modalDescription'
        )}
        confirmText={t('groups:subjectGroup.switchToSupportClass.confim')}
        onClose={() => setSwitchGroupTypeConfirmation(false)}
        onConfirm={() => {
          const partyIds = selectedGroups.map((sg) => sg.id);
          switchSubjectGroupType({
            subjectGroupPartyId: partyIds,
            type: SubjectGroupType.SupportGroup,
          }).then(() => setSwitchGroupTypeConfirmation(false));
        }}
      />
    </>
  );
}
