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
  ValueGetterParams,
  ValueFormatterParams,
  TableSelect,
  ICellEditorParams,
  ValueSetterParams,
  BulkEditedRows,
} from '@tyro/core';

import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { Box, Button, Chip, Fade, Stack } from '@mui/material';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  getPersonProfileLink,
  RecipientSearchType,
  Options_SaveStudentPreference,
  SmsRecipientType,
  usePermissions,
  UsePermissionsReturn,
} from '@tyro/api';
import { useMailSettings } from '@tyro/mail';
import { StudentTableAvatar } from '@tyro/people';
import set from 'lodash/set';
import {
  ReturnTypeFromUseOptionsPreferences,
  useOptionsPreferences,
} from '../../api/options-preferences';
import {
  ReturnTypeFromUseOptionsSetup,
  useOptionsSetup,
} from '../../api/options';
import {
  useAutoGenerateStudentPreferences,
  useSaveStudentPreferences,
} from '../../api/save-student-preferences';

type StudentRow = {
  student: NonNullable<ReturnTypeFromUseOptionsSetup['students']>[number];
  choices: Record<string, number>;
};

function getChoiceIds(choicePath: string) {
  const choiceId = choicePath.includes('.')
    ? choicePath.split('.')[1]
    : choicePath;
  const [subjectSetIdx, preferenceIdx] = choiceId.split('-');
  return {
    subjectSetIdx: Number(subjectSetIdx),
    preferenceIdx: Number(preferenceIdx),
  };
}

const getStudentRows = (
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  choices: ReturnTypeFromUseOptionsPreferences[]
): StudentRow[] => {
  const studentsChoiceMap = new Map<number, Record<string, number>>();

  choices.forEach(({ student, choices: studentsChoices }) => {
    const currentStudentsChoices = studentsChoices.reduce<
      Record<string, number>
    >((acc, { id, subject }) => {
      if (subject) {
        acc[`${id.subjectSetIdx}-${id.preferenceIdx}`] = subject.id;
      }
      return acc;
    }, {});
    studentsChoiceMap.set(student.partyId, currentStudentsChoices);
  });

  return (optionsSetup?.students ?? []).map((student) => ({
    student,
    choices: studentsChoiceMap.get(student.partyId) ?? {},
  }));
};

const getStudentPreferenceColumns = (
  t: TFunction<
    ('common' | 'subjectOptions')[],
    undefined,
    ('common' | 'subjectOptions')[]
  >,
  displayName: ReturnTypeDisplayName,
  optionsSetup: ReturnTypeFromUseOptionsSetup | undefined,
  permissions: UsePermissionsReturn
): GridOptions<StudentRow>['columnDefs'] => [
  {
    colId: 'student',
    headerName: t('common:name'),
    valueGetter: ({ data }) => displayName(data?.student.person),
    cellRenderer: ({ data }: ICellRendererParams<StudentRow, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.student.person}
          to={getPersonProfileLink(data?.student.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    filter: true,
    pinned: 'left',
  },
  ...(optionsSetup?.subjectSets?.map((subjectSet) => ({
    colId: JSON.stringify(subjectSet.id),
    headerName: subjectSet.name,
    headerClass: subjectSet.id.idx !== 1 ? 'border-left' : undefined,
    children: Array.from(Array(subjectSet.canChoose)).map(
      (_, preferenceIdx) => {
        const colId = `${subjectSet.id.idx}-${preferenceIdx}`;
        const isOutsideWhatTheyGet = preferenceIdx >= subjectSet.mustGet;
        const showLeftBorder = preferenceIdx === 0 && subjectSet.id.idx !== 1;
        const options = subjectSet.subjects.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        return {
          field: `choices.${colId}`,
          headerName: isOutsideWhatTheyGet
            ? t('subjectOptions:reserveX', {
                x: preferenceIdx - subjectSet.mustGet + 1,
              })
            : t('subjectOptions:prefX', { x: preferenceIdx + 1 }),
          cellClass: [
            'ag-editable-cell',
            isOutsideWhatTheyGet && 'outside-get',
            showLeftBorder && 'border-left',
          ].filter(Boolean),
          headerClass: [
            isOutsideWhatTheyGet && 'outside-get',
            showLeftBorder && 'border-left',
          ].filter(Boolean),
          valueGetter: ({ data }: ValueGetterParams<StudentRow, any>) =>
            data?.choices[colId],
          valueSetter: ({
            newValue,
            data,
            node,
            isEditCheckCall,
            isApplyUpdatesCall,
          }: ValueSetterParams<StudentRow, number | string | undefined>) => {
            const isNewValueNumber = !Number.isNaN(Number(newValue));
            const keyToFindNewValue = isNewValueNumber
              ? Number(newValue)
              : (newValue as string | undefined)?.toLowerCase();
            const matchedOption = options.find((option) =>
              isNewValueNumber
                ? option.id === keyToFindNewValue
                : option.name.toLowerCase() === keyToFindNewValue
            );

            set(data?.choices, colId, matchedOption?.id);

            if (!isEditCheckCall && !isApplyUpdatesCall) {
              Object.entries(data?.choices).forEach(([key, value]) => {
                const { subjectSetIdx } = getChoiceIds(key);

                if (
                  subjectSetIdx === subjectSet.id.idx &&
                  key !== colId &&
                  value &&
                  value === matchedOption?.id
                ) {
                  node?.setDataValue(`choices.${key}`, null);
                }
              });
            }

            return true;
          },
          cellRenderer: ({
            data,
            value,
          }: ICellRendererParams<StudentRow, number>) => {
            if (!data) return null;
            const subject = subjectSet.subjects.find(({ id }) => id === value);

            if (!subject) return '-';

            return (
              <Chip
                size="small"
                variant="soft"
                color={subject.colour ?? 'slate'}
                label={subject.name}
              />
            );
          },
          valueFormatter: ({
            value,
          }: ValueFormatterParams<StudentRow, number>) => {
            if (typeof value !== 'number') return '-';
            return subjectSet.subjects.find((subject) => subject.id === value)
              ?.name;
          },
          editable: () =>
            permissions.isStaffUserWithPermission(
              'ps:1:options:write_preferences'
            ),
          cellEditorSelector: ({ data }: ICellEditorParams<StudentRow>) => {
            if (data) {
              return {
                component: TableSelect<(typeof options)[number]>,
                popup: true,
                popupPosition: 'under',
                params: {
                  options,
                  optionIdKey: 'id',
                  getOptionLabel: (option: (typeof options)[number]) =>
                    option?.name,
                },
              };
            }
          },
        };
      }
    ),
  })) ?? []),
];

export default function StudentOptionsPreferencesPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation([
    'common',
    'subjectOptions',
    'mail',
    'people',
    'sms',
  ]);
  const [selectedStudents, setSelectedStudents] =
    useState<RecipientsForSmsModal>([]);
  const { sendMailToParties } = useMailSettings();
  const { displayName } = usePreferredNameLayout();
  const permissions = usePermissions();
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const { data: optionsSetup } = useOptionsSetup(optionId);
  const { data: preferences } = useOptionsPreferences({ optionId });
  const { mutateAsync: savePreferences } = useSaveStudentPreferences();
  const { mutateAsync: autoGenerateStudentPrefs } =
    useAutoGenerateStudentPreferences();

  const studentRows = useMemo(
    () => getStudentRows(optionsSetup, preferences ?? []),
    [optionsSetup, preferences]
  );

  const autoGenerate = () => {
    autoGenerateStudentPrefs({
      optionId,
    });
  };

  const studentPreferenceColumns = useMemo(
    () =>
      getStudentPreferenceColumns(t, displayName, optionsSetup, permissions),
    [t, displayName, optionsSetup, permissions]
  );

  const onSavePreferences = (
    updates: BulkEditedRows<StudentRow, `choices.${string}`>
  ) => {
    const newPreferences: Options_SaveStudentPreference[] = [];

    Object.entries(updates).forEach(([partyId, choices]) => {
      Object.entries(choices).forEach(([choicePath, value]) => {
        const { subjectSetIdx, preferenceIdx } = getChoiceIds(choicePath);
        newPreferences.push({
          optionId,
          subjectSetIdx: Number(subjectSetIdx),
          studentPartyId: Number(partyId),
          preferenceIdx: Number(preferenceIdx),
          subjectId: (value?.newValue as number | undefined) ?? 0,
        });
      });
    });

    return savePreferences(newPreferences);
  };

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
        label: t('mail:mailContacts'),
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
        sx={{
          '& .outside-get': {
            backgroundColor: 'slate.100',
          },
          '& .border-left': {
            borderLeft: '1px solid',
            borderLeftColor: 'slate.200',
          },
        }}
        rowData={studentRows}
        columnDefs={studentPreferenceColumns}
        rowSelection="multiple"
        getRowId={({ data }) => JSON.stringify(data?.student?.partyId)}
        rightAdornment={
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Fade in={selectedStudents.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
            {permissions.isTyroUser && (
              <Button
                variant="contained"
                color="primary"
                onClick={autoGenerate}
              >
                {t(`subjectOptions:autoAssignPref`)}
              </Button>
            )}
          </Stack>
        }
        onRowSelection={(students) =>
          setSelectedStudents(
            students.map(({ student }) => {
              const { partyId, avatarUrl } = student.person;
              return {
                id: partyId,
                name: displayName(student.person),
                type: 'individual',
                avatarUrl,
              };
            })
          )
        }
        onBulkSave={onSavePreferences}
        defaultExcelExportParams={{
          processCellCallback: (params) => {
            const value = params.value as number | undefined;
            return params.formatValue(value);
          },
        }}
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
        ]}
      />
    </>
  );
}
