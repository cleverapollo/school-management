import { ResultSet } from '@cubejs-client/core';
import dayjs from 'dayjs';

interface ApexTransformedData {
  series: any[];
  categories: string[];
}

export const DataLayoutType = {
  OneDimension: 'OneDimension',
  TwoDimension: 'TwoDimension',
};

const twoDimentionTimeBased = (
  resultSet: ResultSet
): ApexTransformedData | undefined => {
  const measures = resultSet.query().measures || [];
  const dimensions = resultSet.query().dimensions || [];

  const categories = [] as string[];

  const foundKeys = Object.keys(resultSet.chartPivot()[0]).filter(
    (k) => k !== 'x' && k !== 'xValues'
  );
  const seriesMap = new Map<string, number[]>();
  // eslint-disable-next-line @typescript-eslint/no-for-in-array,guard-for-in,no-restricted-syntax
  // eslint-disable-next-line vars-on-top,no-plusplus,no-var
  for (var i = 0; i < resultSet.chartPivot().length; i++) {
    //
    const row = resultSet.chartPivot()[i];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,no-loop-func,no-plusplus
    for (let j = 0; j < foundKeys.length; j++) {
      const key = foundKeys[j];
      const seriesForKey = seriesMap.get(key) || [];
      seriesForKey.push(row[key] as number);
      seriesMap.set(key, seriesForKey);
    }
    categories.push(dayjs(row.x).format('MMM YY'));
    // categories.push(row.x);
  }
  const series = foundKeys.map((k) => ({
    name: k.split(',')[0],
    data: seriesMap.get(k),
  }));

  return {
    series,
    categories,
  };
};

const twoDimensionNonTimeBased = (
  resultSet: ResultSet
): ApexTransformedData | undefined => {
  const measures = resultSet.query().measures || [];
  const dimensions = resultSet.query().dimensions || [];

  const categories = [] as string[];

  const chartData = resultSet.chartPivot({
    y: [dimensions[0]],
  });
  const allKeys = new Set<string>([]);

  const seriesMap = new Map<string, number[]>();
  for (const row of chartData) {
    const foundKeys = Object.keys(row).filter(
      (k) => k !== 'x' && k !== 'xValues'
    );
    foundKeys.forEach((fk) => allKeys.add(fk));
    for (const key of foundKeys) {
      const seriesForKey = seriesMap.get(key) || [];
      seriesForKey.push(row[key] as number);
      seriesMap.set(key, seriesForKey);
    }
    categories.push(row.xValues[0]);
  }

  const series = Array.from(allKeys).map((k) => ({
    name: k.split(',')[0],
    data: seriesMap.get(k),
  }));

  return {
    series,
    categories,
  };
};

export const transformData = (
  resultSet: ResultSet
): ApexTransformedData | undefined => {
  if ((resultSet.query().timeDimensions || []).length > 0) {
    return twoDimentionTimeBased(resultSet);
  }
  return twoDimensionNonTimeBased(resultSet);
};
