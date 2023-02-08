import React, { useState } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Query, ResultSet } from '@cubejs-client/core';

export interface ChartDefinition {
  component: (props: ChartRendererInternalProps) => JSX.Element;
  drillDownQuery: (
    resultSet: ResultSet,
    e1: any,
    e2: any,
    e3: any
  ) => Query | null;
}

export interface ChartRendererInternalProps {
  resultSet: ResultSet;
  children: any;
  ChartComponent: any;
  height: number;
  onclickEvent?: (a: any, b: any, c: any) => void;
}

export interface ChartRendererPassThroughProps {
  resultSet: ResultSet | null;
  error: Error | null;
  height: number;
  onclickEvent?: (a: any, b: any, c: any) => void;
}
const renderChart =
  (chartDefinition: ChartDefinition) =>
  ({
    resultSet,
    error,
    height,
    onclickEvent,
  }: ChartRendererPassThroughProps) => ({
    c: (resultSet &&
      chartDefinition.component({
        resultSet,
        height,
        onclickEvent,
      } as ChartRendererInternalProps)) ||
      (error && error.toString()) || <CircularProgress color="secondary" />,
  });

export interface ChartRendererProps {
  chartDefinition: ChartDefinition;
  query: Query;
  drillDownDisplayColumns?: string[];
}

const ChartRenderer = ({
  chartDefinition,
  query,
  drillDownDisplayColumns,
}: ChartRendererProps) => {
  // @ts-ignore
  const component = chartDefinition;

  const { resultSet, isLoading, error, progress } = useCubeQuery(query);

  const [drillDownQuery, setDrillDownQuery] = useState<Query>();
  const [open, setOpen] = useState(false);

  // @ts-ignore
  const drillDownResponse = useCubeQuery(drillDownQuery, {
    skip: !drillDownQuery,
  });

  const drillDownData = () =>
    (drillDownResponse.resultSet && drillDownResponse.resultSet.tablePivot()) ||
    [];

  // @ts-ignore
  const handleBarClick = (rs: ResultSet | null) => (a, b, c) => {
    if (rs != null) {
      const ddQuery = component.drillDownQuery(rs, a, b, c);

      if (ddQuery !== null) {
        setDrillDownQuery(ddQuery);
      }
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const c =
    component &&
    renderChart(component)({
      resultSet,
      error,
      height: 400,
      onclickEvent: handleBarClick(resultSet),
    });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <>
      {c.c}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>asdasd</DialogTitle>
        <div>
          {drillDownResponse.isLoading ? (
            'Loading...'
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(drillDownData()[0] || [])
                      .filter(
                        (key) =>
                          drillDownDisplayColumns == null ||
                          drillDownDisplayColumns?.includes(key)
                      )
                      .map((key) => (
                        <TableCell key={key}>{key}</TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                {drillDownData().map((row) => (
                  <TableRow>
                    {Object.keys(row)
                      .filter(
                        (key) =>
                          drillDownDisplayColumns == null ||
                          drillDownDisplayColumns?.includes(key)
                      )
                      .map((key) => (
                        <TableCell key={key}> {row[key]} </TableCell>
                      ))}
                  </TableRow>
                ))}
              </Table>
            </TableContainer>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default ChartRenderer;
