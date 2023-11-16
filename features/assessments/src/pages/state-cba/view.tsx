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
  usePermissions,
} from '@tyro/api';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Chip, Fade, Typography } from '@mui/material';
import {
  CheckmarkCircleIcon,
  MobileIcon,
  SendMailIcon,
  SyncIcon,
} from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import { useAssessmentById } from '../../api/assessments';
import {
  useAssessmentResults,
  ReturnTypeFromUseAssessmentResults,
} from '../../api/assessment-results';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';
import { SyncWithPpodModal } from '../../components/state-cba/sync-with-ppod-modal';

type PpodStatusField = {
  length?: number;
  count: number;
};

const getColumnDefs = (
  isDesktop: boolean,
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  displayNames: ReturnTypeDisplayNames,
  getPpodSyncedStatus: (subjectPartyId: number) => PpodStatusField
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
  // ** THIS WILL BE REPLACED WITH GRADE RESULTS WHEN BE UPDATES ENDPOINT **
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
    colId: 'ppodPublished',
    headerName: t('assessments:ppodStatus'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentResults, any>) => {
      const ppodInfo = getPpodSyncedStatus(data?.subjectGroup?.partyId ?? 0);
      if (
        ppodInfo?.length &&
        ppodInfo?.count > 0 &&
        ppodInfo?.count < ppodInfo?.length
      ) {
        return (
          <Chip
            sx={{ pointerEvents: 'none' }}
            label={t('assessments:partiallySynced')}
            variant="soft"
            color="yellow"
          />
        );
      }
      if (ppodInfo?.count === ppodInfo?.length) {
        return (
          <Chip
            sx={{ pointerEvents: 'none' }}
            label={t('assessments:synced')}
            variant="soft"
            color="success"
          />
        );
      }
      return (
        <Chip
          sx={{ pointerEvents: 'none' }}
          label={t('assessments:notSynced')}
          variant="soft"
          color="error"
        />
      );
    },
  },
  // ** THIS NEEDS TO BE UPDATED WHEN BE RETURNS TOTALS FOR GRADE RESULTS
  {
    colId: 'publishedOnline',
    headerName: t('assessments:publishedOnline'),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) => {
      const isExaminable = false;
      return isExaminable ? <TableBooleanValue value={isExaminable} /> : '-';
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
  const [selectedAssessments, setSelectedAssessments] = useState<
    ReturnTypeFromUseAssessmentSubjectGroups[]
  >([]);

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
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

  function getPpodSyncedStatus(subjectPartyId: number) {
    let count = 0;
    studentResults?.map((student) => {
      if (
        student?.ppodPublished === true &&
        student?.subjectGroup?.partyId === subjectPartyId
      ) {
        return (count += 1);
      }
      return count;
    });
    return { length: studentResults?.length, count };
  }

  const isDesktop = useResponsive('up', 'md');
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
    () => getColumnDefs(!!isDesktop, t, displayNames, getPpodSyncedStatus),
    [t, displayNames, getPpodSyncedStatus]
  );

  const {
    isOpen: isSyncWithPpodOpen,
    onOpen: onSyncWithPpodOpen,
    onClose: onCloseSyncWithPpod,
  } = useDisclosure();

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
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
        },
        {
          label: t('assessments:actions.publish'),
          icon: <CheckmarkCircleIcon />,
          onClick: () => console.log('Publish online'),
          disabled: true,
        },
      ],
    ];
    return commonActions;
  }, [t, hasPermission, staffFromSelectedGroups, isSendSmsOpen]);

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
      </PageContainer>
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
