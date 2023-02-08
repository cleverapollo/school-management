import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { DrillDownLocator, Query, ResultSet } from '@cubejs-client/core';
import { CartesianChart, ChartRendererInternalProps } from './CartesianChart';
import { ApexPieChart } from './ApexPieChart';
import { ApexBarChart } from './ApexBarChart';
// import {ResultSet} from "@cubejs-client/core";

const colors = ['#7DB3FF', '#49457B', '#FF7C78'];
//
// export const TypeToChartComponent = {
//   line: {
//     component: ({ resultSet, height }: ChartRendererInternalProps) => (
//       <CartesianChart
//         resultSet={resultSet}
//         height={height}
//         ChartComponent={LineChart}
//       >
//         {resultSet.seriesNames().map((series, i) => (
//           <Line
//             key={series.key}
//             // stackId="a"
//             dataKey={series.key}
//             name={series.title}
//             stroke={colors[i]}
//           />
//         ))}
//       </CartesianChart>
//     ),
//   } as ChartDefinition,
//   bar: ApexBarChart,
//   // bar: {
//   //   component: ({
//   //     resultSet,
//   //     height,
//   //     onclickEvent,
//   //   }: ChartRendererInternalProps) => (
//   //     <CartesianChart
//   //       resultSet={resultSet}
//   //       height={height}
//   //       ChartComponent={BarChart}
//   //     >
//   //       {resultSet.seriesNames().map((series, i) => (
//   //         <Bar
//   //           key={series.key}
//   //           stackId="a"
//   //           onClick={(e, o, c) => onclickEvent && onclickEvent(e, o, c)}
//   //           dataKey={series.key}
//   //           name={series.title}
//   //           fill={colors[i]}
//   //         />
//   //       ))}
//   //     </CartesianChart>
//   //   ),
//   //   drillDownQuery: (resultSet, event, yValues): any => {
//   //     console.log(yValues);
//   //     console.log(event);
//   //     // @ts-ignore
//   //     if (resultSet != null && event.xValues != null) {
//   //       // @ts-ignore
//   //       const locator = {
//   //         xValues: event.xValues,
//   //         yValues: ['Exp', 'Elizabeth Jenkins', '925'],
//   //       } as DrillDownLocator;
//   //       console.log(locator);
//   //       return resultSet.drillDown(locator);
//   //     }
//   //   },
//   // } as ChartDefinition,
//
//   area: {
//     component: ({ resultSet, height }: ChartRendererInternalProps) => (
//       <CartesianChart
//         resultSet={resultSet}
//         height={height}
//         ChartComponent={AreaChart}
//       >
//         {resultSet.seriesNames().map((series, i) => (
//           <Area
//             key={series.key}
//             stackId="a"
//             dataKey={series.key}
//             name={series.title}
//             stroke={colors[i]}
//             fill={colors[i]}
//           />
//         ))}
//       </CartesianChart>
//     ),
//   } as ChartDefinition,
//   pie: ApexPieChart,
//   table: {
//     component: ({ resultSet }: ChartRendererInternalProps) => (
//       <Table aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             {resultSet.tableColumns().map((c) => (
//               <TableCell key={c.key}>{c.title}</TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {resultSet.tablePivot().map((row, index) => (
//             <TableRow key={index}>
//               {resultSet.tableColumns().map((c) => (
//                 <TableCell key={c.key}>{row[c.key]}</TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     ),
//   } as ChartDefinition,
//   number: {
//     component: ({ resultSet }: ChartRendererInternalProps) => (
//       <div>
//         {resultSet.seriesNames().map((s) => (
//           <div>{resultSet.totalRow()[s.key]} </div>
//         ))}
//       </div>
//     ),
//   } as ChartDefinition,
// };
