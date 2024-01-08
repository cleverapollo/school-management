import React, { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  Table,
  TableLinearProgress,
  TableBooleanValue,
  useNumber,
  PageContainer,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  useResponsive,
  useDisclosure,
  ActionMenu,
  ActionMenuProps,
} from '@tyro/core';
import {
  Search,
  SearchType,
  SmsRecipientType,
  SyncStatus,
  usePermissions,
} from '@tyro/api';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Chip, ChipProps, Fade, Typography } from '@mui/material';
import { MobileIcon, SendMailIcon, SyncIcon } from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import { useAssessmentById } from '../../api/assessments';
import { useAssessmentResults } from '../../api/assessment-results';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';
import { SyncWithPpodModal } from '../../components/state-cba/sync-with-ppod-modal';

const getColumnDefs = (
  isDesktop: boolean,
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseAssessmentSubjectGroups>['columnDefs'] => [
  {
    field: 'subjectGroup.name',
    headerName: t('assessments:subjectGroup'),
    sort: 'asc',
    suppressSizeToFit: isDesktop,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
  },
  {
    field: 'resultsTotal',
    headerName: t('assessments:results'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) =>
      data && `${data?.resultsEntered ?? '-'}/${data?.resultsTotal ?? '-'}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) => (
      <TableLinearProgress
        value={data?.resultsEntered}
        total={data?.resultsTotal}
      />
    ),
  },
  {
    field: 'subjectGroup.staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.subjectGroup.staff),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography component="span" variant="body2" noWrap>
          {displayNames(data?.subjectGroup.staff)}
        </Typography>
      ),
  },
  {
    field: 'ppodSyncStatus',
    headerName: t('assessments:ppodStatus'),
    valueGetter: ({ data }) => data?.ppodSyncStatus || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups, any>) => {
      const status = data?.ppodSyncStatus;
      const codeTypeColorMapping: Record<SyncStatus, ChipProps['color']> = {
        [SyncStatus.FullySynced]: 'success',
        [SyncStatus.PartiallySynced]: 'yellow',
        [SyncStatus.NotSynced]: 'error',
      };
      if (status) {
        return (
          <Chip
            label={t(`assessments:syncStatus.${status}`)}
            variant="soft"
            color={codeTypeColorMapping[status]}
          />
        );
      }
    },
  },
  {
    field: 'published',
    headerName: t('assessments:publishedOnline'),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) => {
      const isPublished = data?.published ?? false;
      return isPublished ? <TableBooleanValue value={isPublished} /> : '-';
    },
  },
  {
    colId: 'editResults',
    headerName: '',
    suppressSizeToFit: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups, any>) =>
      data && (
        <Button
          className="ag-show-on-row-interaction"
          component={Link}
          to={`./subject-group/${data.subjectGroup.partyId}`}
        >
          {t('assessments:actions.editResults')}
        </Button>
      ),
  },
];

export default function ViewStateCba() {
  const { hasPermission } = usePermissions();
  const { t } = useTranslation([
    'assessments',
    'common',
    'people',
    'sms',
    'mail',
  ]);
  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const { displayName, displayNames } = usePreferredNameLayout();
  const isDesktop = useResponsive('up', 'md');
  const [selectedAssessments, setSelectedAssessments] = useState<
    ReturnTypeFromUseAssessmentSubjectGroups[]
  >([]);

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const {
    isOpen: isSyncWithPpodOpen,
    onOpen: onSyncWithPpodOpen,
    onClose: onCloseSyncWithPpod,
  } = useDisclosure();

  const { composeEmail } = useMailSettings();

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: assessmentSubjectGroupsData = [] } = useAssessmentSubjectGroups(
    academicNameSpaceIdAsNumber ?? 0,
    {
      assessmentId: assessmentIdAsNumber,
    }
  );

  const subjectGroupIds = assessmentSubjectGroupsData?.map(
    (subject) => subject?.subjectGroup?.partyId
  );

  const assessmentResultsFilter = {
    assessmentId: assessmentIdAsNumber ?? 0,
    subjectGroupIds,
  };
  const { data: studentResults } = useAssessmentResults(
    academicNameSpaceIdAsNumber ?? 0,
    assessmentResultsFilter
  );

  const staffFromSelectedGroups = useMemo(() => {
    const uniqueStaffList = selectedAssessments.reduce(
      (acc, { subjectGroup }) => {
        subjectGroup.staff.forEach((staff) => {
          acc.set(staff.partyId, {
            name: displayName(staff),
            id: staff.partyId,
            type: 'individual',
            avatarUrl: staff?.avatarUrl,
          });
        });
        return acc;
      },
      new Map<number, RecipientsForSmsModal[number]>()
    );

    return Array.from(uniqueStaffList.values());
  }, [selectedAssessments]);

  const sendMailToSelectedStaff = () => {
    const uniqueStaffList = selectedAssessments.reduce(
      (acc, { subjectGroup }) => {
        subjectGroup.staff.forEach((staff) => {
          acc.set(staff.partyId, {
            partyId: staff.partyId,
            type: SearchType.Staff,
            text: displayName(staff),
            avatarUrl: staff?.avatarUrl,
          });
        });
        return acc;
      },
      new Map<number, Omit<Search, 'meta'>>()
    );

    composeEmail({
      canReply: false,
      bccRecipients: Array.from(uniqueStaffList.values()),
    });
  };

  const columnDefs = useMemo(
    () => getColumnDefs(!!isDesktop, t, displayNames),
    [t, displayNames]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      hasPermission('ps:1:communications:send_sms')
        ? [
            {
              label: t('people:sendSms'),
              icon: <MobileIcon />,
              onClick: onOpenSendSms,
            },
          ]
        : [
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
          ],
      [
        {
          label: t('assessments:syncWithPpod'),
          icon: <SyncIcon />,
          onClick: onSyncWithPpodOpen,
          hasAccess: () => hasPermission('ps:1:assessment:cba_sync_ppod'),
        },
      ],
    ],
    [t, hasPermission, staffFromSelectedGroups, isSendSmsOpen]
  );

  return (
    <>
      <PageContainer
        title={t('assessments:pageTitle.termAssessmentSubjectGroups')}
      >
        <PageHeading
          title={t('assessments:pageHeading.termAssessmentSubjectGroups', {
            name: assessmentData?.name,
          })}
          breadcrumbs={{
            links: [
              {
                name: t('assessments:pageHeading.assessments'),
                href: '/assessments',
              },
              {
                name: t('assessments:pageHeading.termAssessmentSubjectGroups', {
                  name: assessmentData?.name,
                }),
              },
            ],
          }}
        />
        <Table
          rowData={assessmentSubjectGroupsData || []}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data?.subjectGroup.partyId)}
          onRowSelection={setSelectedAssessments}
          rowSelection="multiple"
          rightAdornment={
            <Fade in={selectedAssessments.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onFirstDataRendered={(params) => {
            params.columnApi.autoSizeColumns([
              'subjectGroup.name',
              'resultsTotal',
              'commentsTotal',
              'editResults',
            ]);
            params.api.sizeColumnsToFit();
          }}
        />
      </PageContainer>
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={staffFromSelectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:teachersOfGroup', {
              count: staffFromSelectedGroups.length,
            }),
            type: SmsRecipientType.Staff,
          },
        ]}
      />
      <SyncWithPpodModal
        isOpen={isSyncWithPpodOpen}
        onClose={onCloseSyncWithPpod}
        initialState={selectedAssessments}
        assessmentId={assessmentIdAsNumber}
        studentResults={studentResults}
      />
    </>
  );
}
