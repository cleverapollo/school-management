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
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { useState, useEffect } from 'react';
import { ReturnTypeFromUseOptionSolveSubjectStats } from '../../../api/solve/subject-stats';

interface SubjectStatsTableProps {
  rowData: ReturnTypeFromUseOptionSolveSubjectStats[];
  onRowDataChange?: (
    newRowData: (SubjectStatsTableProps['rowData'][number] & {
      numberOfClasses: number;
    })[]
  ) => void;
}

export function SubjectStatsTable({
  rowData,
  onRowDataChange,
}: SubjectStatsTableProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);
  const [editableRowData, setEditableRowData] = useState<
    (SubjectStatsTableProps['rowData'][number] & { numberOfClasses: number })[]
  >([]);

  const editMaxSize = (newMaxSize: number, rowIndex: number) => {
    setEditableRowData((prev) => {
      const newRowData = [...prev];
      newRowData[rowIndex].maxSize = newMaxSize;
      return newRowData;
    });
  };

  const editNumberOfClasses = (
    newNumberOfClasses: number,
    rowIndex: number
  ) => {
    setEditableRowData((prev) => {
      const newRowData = [...prev];
      newRowData[rowIndex].numberOfClasses = newNumberOfClasses;
      return newRowData;
    });
  };

  useEffect(() => {
    if (typeof onRowDataChange === 'function') {
      onRowDataChange(editableRowData);
    }
  }, [editableRowData, onRowDataChange]);

  useEffect(() => {
    setEditableRowData(
      rowData.map((row) => ({
        ...row,
        numberOfClasses: row.teachingGroups.length,
      }))
    );
  }, [rowData]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('common:subject')}</TableCell>
            <TableCell>{t('subjectOptions:maxInClass')}</TableCell>
            <TableCell>{t('subjectOptions:noOfClasses')}</TableCell>
            <TableCell>{t('subjectOptions:classSizes')}</TableCell>
            <TableCell>{t('subjectOptions:prefsMissed')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editableRowData.map((row, index) => (
            <TableRow key={row.subjectId}>
              <TableCell component="th" scope="row">
                <Chip
                  label={row.subject?.name}
                  color={row.subject?.colour ?? 'slate'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  hiddenLabel
                  variant="standard"
                  value={row.maxSize}
                  type="number"
                  onChange={(e) => editMaxSize(Number(e.target.value), index)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  hiddenLabel
                  variant="standard"
                  value={row.numberOfClasses}
                  type="number"
                  onChange={(e) =>
                    editNumberOfClasses(Number(e.target.value), index)
                  }
                />
              </TableCell>
              <TableCell>
                {row.teachingGroups.map((group) => (
                  <Tooltip key={group.id} title={group.name}>
                    <Chip
                      label={group.numStudents.toString()}
                      color={getColorBasedOnIndex(group.blockIdx)}
                      size="small"
                    />
                  </Tooltip>
                ))}
              </TableCell>
              <TableCell>
                {row.preferencesTotal - row.preferencesGotten}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
