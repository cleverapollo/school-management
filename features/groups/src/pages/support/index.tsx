import { Box, Fade, Container, Typography } from '@mui/material';
import {
  PermissionUtils,
  SmsRecipientType,
  SubjectGroupType,
  SubjectUsage,
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
  BulkEditedRows,
  TableAvatar,
  useDisclosure,
  sortStartNumberFirst,
  ConfirmDialog,
  TableSelect,
  ActionMenuProps,
} from '@tyro/core';

import { MobileIcon, MoveGroupIcon, SendMailIcon } from '@tyro/icons';

import { set } from 'lodash';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { CatalogueSubjectOption, useCatalogueSubjects } from '@tyro/settings';
import {
  useSaveSupportGroupEdits,
  useSupportGroups,
} from '../../api/support-groups';
import { useSwitchSubjectGroupType } from '../../api';
import { useBulkPrintGroupMembers } from '../../hooks';

type ReturnTypeFromUseSupportGroups = NonNullable<
  ReturnType<typeof useSupportGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames,
  subjects?: CatalogueSubjectOption[]
): GridOptions<ReturnTypeFromUseSupportGroups>['columnDefs'] => [
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
    }: ICellRendererParams<ReturnTypeFromUseSupportGroups>) => {
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
    cellEditorSelector: () =>
      ({
        component: TableSelect<CatalogueSubjectOption>,
        popup: true,
        popupPosition: 'under',
        params: {
          options: subjects,
          optionIdKey: 'id',
          getOptionLabel: (option: CatalogueSubjectOption) =>
            `${option.name} (${option.nationalCode})`,
        },
      } as const),
    enableRowGroup: true,
  },
  {
    field: 'studentMembers.memberCount',
    headerName: t('common:members'),
    sortable: true,
  },
  {
    field: 'yearGroups',
    headerName: t('common:year'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.yearGroups?.map((year) => year?.name).join(', '),
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
];

export default function SupportGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const { data: subjectGroupsData } = useSupportGroups();
  const { data: subjects } = useCatalogueSubjects({
    filterUsage: SubjectUsage.All,
  });
  const { mutateAsync: updateSubjectGroup } = useSaveSupportGroupEdits();
  const { mutateAsync: switchSubjectGroupType } = useSwitchSubjectGroupType();

  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const bulkPrintOption = useBulkPrintGroupMembers({
    groups: selectedGroups,
    groupKey: 'supportGroups',
  });
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

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
      },
      {
        label: t('groups:supportGroup.switchToSubjectGroup.action'),
        icon: <MoveGroupIcon />,
        onClick: () => setSwitchGroupTypeConfirmation(true),
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission('ps:1:groups:write_subject_groups'),
      },
      // {
      //   label: t('mail:sendMail'),
      //   icon: <SendMailIcon />,
      //   onClick: () => {},
      // },
      bulkPrintOption,
    ],
    [bulkPrintOption]
  );

  const handleBulkSave = (
    data: BulkEditedRows<ReturnTypeFromUseSupportGroups, 'name' | 'subjects'>
  ) => {
    const updates = Object.entries(data).reduce<UpdateSubjectGroupInput[]>(
      (acc, [partyId, changes]) => {
        const updatedEntry: UpdateSubjectGroupInput = {
          subjectGroupPartyId: Number(partyId),
        };

        Object.entries(changes).forEach(([key, value]) => {
          if (key === 'subjects' && value?.newValue?.length) {
            set(updatedEntry, 'subjectIds', [
              (value?.newValue?.[0] as CatalogueSubjectOption)?.id,
            ]);
          } else {
            set(updatedEntry, key, value.newValue);
          }
        });

        acc.push(updatedEntry);
        return acc;
      },
      []
    );

    return updateSubjectGroup(updates);
  };

  return (
    <>
      <Page title={t('groups:supportGroups')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('groups:supportGroups')}
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
            type: SmsRecipientType.GeneralGroupContact,
          },
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.GeneralGroupStaff,
          },
        ]}
      />

      <ConfirmDialog
        open={!!switchGroupTypeConfirmation}
        title={t('groups:supportGroup.switchToSubjectGroup.modalTitle')}
        description={t(
          'groups:supportGroup.switchToSubjectGroup.modalDescription'
        )}
        confirmText={t('groups:supportGroup.switchToSubjectGroup.confim')}
        onClose={() => setSwitchGroupTypeConfirmation(false)}
        onConfirm={() => {
          const partyIds = selectedGroups.map((sg) => sg.id);
          switchSubjectGroupType({
            subjectGroupPartyId: partyIds,
            type: SubjectGroupType.SubjectGroup,
          }).then(() => setSwitchGroupTypeConfirmation(false));
        }}
      />
    </>
  );
}
