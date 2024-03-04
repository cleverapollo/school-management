import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Chip,
  Card,
  Stack,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { useMemo } from 'react';
import { ReturnTypeFromUseOptionsSolutions } from '../../../api/options-solutions';

interface SubjectStatsTableProps {
  rowData: ReturnTypeFromUseOptionsSolutions['pools'][number]['subjects'];
  blocks: ReturnTypeFromUseOptionsSolutions['pools'][number]['blocks'];
  onRowDataChange: (newRowData: SubjectStatsTableProps['rowData']) => void;
}

export function SubjectStatsTable({
  rowData,
  blocks,
  onRowDataChange,
}: SubjectStatsTableProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const blocksBasedOnSubjectId = useMemo(
    () =>
      blocks.reduce((acc, block) => {
        block.subjectGroups.forEach((subject) => {
          if (acc.has(subject.subjectId)) {
            acc.get(subject.subjectId)?.push(subject);
          } else {
            acc.set(subject.subjectId, [subject]);
          }
        });

        return acc;
      }, new Map<number, ReturnTypeFromUseOptionsSolutions['pools'][number]['blocks'][number]['subjectGroups']>()),
    [blocks]
  );

  const editMaxSize = (newValue: string, rowIndex: number) => {
    let newMaxSize = newValue === '' ? null : Number(newValue);

    if (typeof newMaxSize === 'number' && newMaxSize < 0) {
      newMaxSize = 0;
    }

    rowData[rowIndex].maxSize = newMaxSize as number;
    onRowDataChange([...rowData]);
  };

  const editNumberOfClasses = (newValue: string, rowIndex: number) => {
    let newNumberOfClasses = newValue === '' ? null : Number(newValue);

    if (typeof newNumberOfClasses === 'number' && newNumberOfClasses < 0) {
      newNumberOfClasses = 0;
    }

    rowData[rowIndex].numClasses = newNumberOfClasses as number;
    onRowDataChange([...rowData]);
  };

  return (
    <TableContainer component={Card}>
      <Table
        size="small"
        sx={{
          '& th': {
            backgroundColor: 'white',
          },
          '& tbody td, & tbody th': {
            borderTop: '1px solid',
            borderTopColor: 'slate.200',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>{t('common:subject')}</TableCell>
            <TableCell>{t('subjectOptions:maxInClass')}</TableCell>
            <TableCell>{t('subjectOptions:noOfClasses')}</TableCell>
            <TableCell>{t('subjectOptions:prefTotal')}</TableCell>
            <TableCell>{t('subjectOptions:spacesShort')}</TableCell>
            <TableCell>{t('subjectOptions:missed')}</TableCell>
            <TableCell>{t('subjectOptions:classSizes')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow key={row.subjectId}>
              <TableCell component="th" scope="row">
                {row.subject?.shortCode}
              </TableCell>
              <TableCell>
                <TextField
                  hiddenLabel
                  variant="filled"
                  value={row.maxSize}
                  size="small"
                  type="number"
                  onChange={(e) => {
                    editMaxSize(e.target.value, index);
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      editMaxSize('0', index);
                    }
                  }}
                  sx={{
                    width: 80,
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  hiddenLabel
                  variant="filled"
                  value={row.numClasses}
                  size="small"
                  type="number"
                  onChange={(e) => editNumberOfClasses(e.target.value, index)}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      editNumberOfClasses('0', index);
                    }
                  }}
                  sx={{
                    width: 80,
                  }}
                />
              </TableCell>
              <TableCell>{row.numPreferences}</TableCell>
              <TableCell>
                {Math.max(
                  0,
                  (row.maxSize * row.numClasses - row.numPreferences) * -1
                )}
              </TableCell>
              <TableCell>{row.missed}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                  {(blocksBasedOnSubjectId.get(row.subjectId) ?? []).map(
                    (subjectBlock) => (
                      <Tooltip key={subjectBlock.id} title={subjectBlock.name}>
                        <Chip
                          label={subjectBlock.numStudents ?? 0}
                          color={getColorBasedOnIndex(subjectBlock.blockIdx)}
                          size="small"
                          sx={{ lineHeight: 1.5, minWidth: 24 }}
                          variant="soft"
                        />
                      </Tooltip>
                    )
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
