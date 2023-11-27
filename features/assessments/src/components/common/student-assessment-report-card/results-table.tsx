import {
  Box,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { TableStudyLevelChip } from '@tyro/core';
import { ReturnTypeFromUseStudentAssessmentResults } from '../../../api/term-assessments/student-results';
import { useStudentAssessmentReportCardSettings } from './settings';
import { ColorCard } from './color-card';
import { ReturnTypeFromUseAssessmentById } from '../../../api/assessments';
import { getRowDetailsFromResult } from '../../../utils/get-row-details-from-result';

interface ReportCardResultTableProps {
  results: ReturnTypeFromUseStudentAssessmentResults;
  extraFields: ReturnTypeFromUseAssessmentById['extraFields'];
}

type GridRowProps = {
  rowType?: 'header' | 'body';
  columns: [
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
    React.ReactNode
  ];
};

function getGridColumnWidth(index: number) {
  switch (index) {
    case 0:
      return `30%`;
    case 1:
    case 2:
    case 3:
      return `15%`;
    default:
      return undefined;
  }
}

function GridRow({ rowType = 'body', columns }: GridRowProps) {
  return (
    <Stack direction="row" role="row">
      {columns.map((column, index) => (
        <Box
          key={index}
          role={rowType === 'header' ? 'columnheader' : 'gridcell'}
          aria-colindex={index + 1}
          sx={{
            width: getGridColumnWidth(index),
            flex: index === 4 ? 1 : undefined,
            p: 0.5,
          }}
          display="flex"
          justifyContent={[0, 4].includes(index) ? 'flex-start' : 'center'}
          alignItems="center"
        >
          {column}
        </Box>
      ))}
    </Stack>
  );
}

export function ReportCardResultTable({
  results,
  extraFields,
}: ReportCardResultTableProps) {
  const { t } = useTranslation(['common']);
  const { isMobile, isMobileCommentsShowing } =
    useStudentAssessmentReportCardSettings();

  const mobileHeadings = [
    t('common:subject'),
    t('common:level'),
    t('common:result'),
    t('common:grade'),
    t('common:teacher'),
  ];

  const extraFieldNames = useMemo(
    () =>
      (extraFields ?? []).reduce((acc, extraField) => {
        acc.set(extraField.id, extraField.name);
        return acc;
      }, new Map<number, string>()),
    [extraFields]
  );

  return isMobile ? (
    <Stack role="treegrid" px={1} pt={0.5} pb={1.5} spacing={0.5}>
      <GridRow
        rowType="header"
        columns={
          mobileHeadings.map((heading) => (
            <Typography
              key={heading}
              variant="subtitle2"
              component="span"
              color="text.secondary"
              fontSize="0.75rem"
            >
              {heading}
            </Typography>
          )) as GridRowProps['columns']
        }
      />
      {results?.map(({ id, ...studentResult }) => {
        const { subject, teacherNames, result, grade, studyLevel } =
          getRowDetailsFromResult(studentResult);

        return (
          <Stack
            key={`${id ?? 0}-${studentResult.subjectGroup.partyId}`}
            role="rowgroup"
          >
            <GridRow
              columns={[
                <ColorCard
                  isMobile
                  text={subject?.name}
                  color={subject?.colour}
                />,
                <TableStudyLevelChip level={studyLevel} condensed />,
                <Typography variant="body2" fontSize="0.75rem">
                  {typeof result === 'number' ? `${result}%` : '-'}
                </Typography>,
                <Typography variant="body2" fontSize="0.75rem">
                  {grade ?? '-'}
                </Typography>,
                <Typography variant="body2" fontSize="0.75rem">
                  {teacherNames}
                </Typography>,
              ]}
            />
            <Collapse unmountOnExit in={isMobileCommentsShowing}>
              <Stack px={0.5} pt={0.5} spacing={1}>
                <ColorCard
                  isMobile
                  text={studentResult?.teacherComment?.comment ?? '-'}
                />
                {studentResult.extraFields?.map((extraField) => (
                  <ColorCard
                    key={extraField.id}
                    isMobile
                    text={
                      <>
                        <strong>
                          {extraFieldNames.get(
                            extraField.assessmentExtraFieldId
                          )}
                        </strong>
                        <Box component="span" fontWeight="400">
                          : {extraField?.result ?? '-'}
                        </Box>
                      </>
                    }
                  />
                ))}
              </Stack>
            </Collapse>
          </Stack>
        );
      })}
    </Stack>
  ) : (
    <TableContainer>
      <Table
        size="small"
        sx={({ palette }) => ({
          '& th, & td': {
            border: `1px solid ${palette.divider}`,
            px: 2,
            py: 1.25,
            verticalAlign: 'middle',
          },
          '& th': {
            background: 'transparent',
            color: 'text.secondary',
            fontWeight: 600,
            borderTop: 'none',
          },
          '& th:first-of-type, & td:first-of-type': {
            borderLeft: 'none',
            maxWidth: 180,
          },
          '& th:last-of-type, & td:last-of-type': {
            borderRight: 'none',
          },
          '& th:nth-of-type(2), & td:nth-of-type(2), & th:nth-of-type(3), & td:nth-of-type(3), & th:nth-of-type(4), & td:nth-of-type(4)':
            {
              textAlign: 'center',
              width: 100,
            },
          '& tr:last-of-type td': {
            borderBottom: 'none',
          },
        })}
      >
        <TableHead>
          <TableRow>
            <TableCell>{t('common:subject')}</TableCell>
            <TableCell>{t('common:level')}</TableCell>
            <TableCell>{t('common:result')}</TableCell>
            <TableCell>{t('common:grade')}</TableCell>
            <TableCell>{t('common:teacher')}</TableCell>
            <TableCell>{t('common:comment')}</TableCell>
            {extraFields?.map((extraField) => (
              <TableCell key={extraField.id}>{extraField.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results?.map(({ id, ...studentResult }) => {
            const { subject, teacherNames, result, grade, studyLevel } =
              getRowDetailsFromResult(studentResult);
            return (
              <TableRow
                key={`${id ?? 0}-${studentResult.subjectGroup.partyId}`}
              >
                <TableCell>
                  <ColorCard text={subject?.name} color={subject?.colour} />
                </TableCell>
                <TableCell>
                  <TableStudyLevelChip level={studyLevel} condensed />
                </TableCell>
                <TableCell>
                  {typeof result === 'number' ? `${result}%` : '-'}
                </TableCell>
                <TableCell>{grade ?? '-'}</TableCell>
                <TableCell>{teacherNames}</TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  {studentResult?.teacherComment?.comment ?? '-'}
                </TableCell>
                {extraFields?.map((extraField) => {
                  const extraFieldResult = studentResult.extraFields?.find(
                    ({ assessmentExtraFieldId }) =>
                      assessmentExtraFieldId === extraField.id
                  );

                  return (
                    <TableCell key={extraField.id}>
                      {extraFieldResult?.result ?? '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
