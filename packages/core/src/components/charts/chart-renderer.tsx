import { ReactNode, useMemo, useState } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Query, ResultSet } from '@cubejs-client/core';
import { Dialog, DialogContent, DialogProps, DialogTitle } from '../dialog';
import { useDisclosure } from '../../hooks/use-disclosure';

export interface ChartDefinition {
  component: (props: ChartRendererInternalProps) => JSX.Element;
  drillDownQuery: (
    resultSet: ResultSet,
    e1: any,
    e2: any,
    e3: any
  ) => Query | null;
}

export interface ChartRendererProps {
  chartDefinition: ChartDefinition;
  query: Query;
  height?: number;
  emptyState?: JSX.Element;
  drillDownConfig?: {
    heading?: string;
    columns?: Array<DrillDownColumn>;
    dialogProps?: DialogProps;
  };
}

export interface ChartRendererInternalProps {
  resultSet: ResultSet;
  children: any;
  ChartComponent: any;
  height: number;
  emptyState?: ChartRendererProps['emptyState'];
  onClick?: (a: any, b: any, c: any) => void;
}

export interface ChartRendererPassThroughProps {
  resultSet: ChartRendererInternalProps['resultSet'] | null;
  error: Error | null;
  height: number;
  emptyState?: ChartRendererProps['emptyState'];
  onClick?: ChartRendererInternalProps['onClick'];
}

const renderChart =
  (chartDefinition: ChartDefinition) =>
  ({
    resultSet,
    error,
    height,
    emptyState,
    onClick,
  }: ChartRendererPassThroughProps) => ({
    c: (resultSet &&
      chartDefinition.component({
        resultSet,
        height,
        emptyState,
        onClick,
      } as ChartRendererInternalProps)) ||
      (error && error.toString()) || (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height,
            width: '100%',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ),
  });

type DrillDownColumn = {
  field: string;
  headerName: string;
  cellRenderer?: (
    value: string | number | boolean
  ) => ReactNode | string | number | boolean;
};

export const ChartRenderer = ({
  chartDefinition,
  query,
  height = 280,
  emptyState,
  drillDownConfig,
}: ChartRendererProps) => {
  const component = chartDefinition;

  const { resultSet, error } = useCubeQuery(query);

  const [drillDownQuery, setDrillDownQuery] = useState<Query>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const drilldownColumnsAsObject = useMemo(() => {
    if (!drillDownConfig?.columns) return null;

    return drillDownConfig.columns.reduce<Record<string, DrillDownColumn>>(
      (acc, column) => {
        const { field } = column;

        return {
          ...acc,
          [field]: column,
        };
      },
      {}
    );
  }, [drillDownConfig]);
  const drilldownFields = Object.keys(drilldownColumnsAsObject ?? {});

  // @ts-expect-error
  const drillDownResponse = useCubeQuery(drillDownQuery, {
    skip: !drillDownQuery,
  });

  const drillDownData = () =>
    (drillDownResponse.resultSet && drillDownResponse.resultSet.tablePivot()) ||
    [];

  // @ts-expect-error
  const handleBarClick = (rs: ResultSet | null) => (a, b, c) => {
    if (rs != null) {
      const ddQuery = component.drillDownQuery(rs, a, b, c);

      if (ddQuery !== null) {
        setDrillDownQuery(ddQuery);
      }
      onOpen();
    }
  };

  const c =
    component &&
    renderChart(component)({
      resultSet,
      error,
      height,
      emptyState,
      onClick: handleBarClick(resultSet),
    });

  return (
    <>
      {c.c}
      <Dialog
        fullWidth
        maxWidth="sm"
        {...(drillDownConfig?.dialogProps ?? {})}
        open={isOpen}
        onClose={onClose}
      >
        {drillDownConfig?.heading && (
          <DialogTitle onClose={onClose}>{drillDownConfig.heading}</DialogTitle>
        )}
        <DialogContent sx={{ p: 0 }}>
          {drillDownResponse.isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
                width: '100%',
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(drillDownData()[0] || [])
                      .filter(
                        (key) =>
                          !drillDownConfig?.columns ||
                          drilldownFields.includes(key)
                      )
                      .map((key) => {
                        const { headerName } =
                          drilldownColumnsAsObject?.[key] ?? {};
                        return (
                          <TableCell key={key}>{headerName ?? key}</TableCell>
                        );
                      })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drillDownData().map((row) => (
                    <TableRow>
                      {Object.keys(row)
                        .filter(
                          (key) =>
                            !drillDownConfig?.columns ||
                            drilldownFields.includes(key)
                        )
                        .map((key) => {
                          const { cellRenderer } =
                            drilldownColumnsAsObject?.[key] ?? {};
                          const value =
                            typeof cellRenderer === 'function'
                              ? cellRenderer(row[key])
                              : row[key];
                          return <TableCell key={key}>{value}</TableCell>;
                        })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
