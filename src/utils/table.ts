import { compareItems, RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { sortingFns, FilterFn, SortingFn } from '@tanstack/react-table';
import { TableColumn, TitleOverride } from "../components/table/types";

export function calculateColumnsWithPermissions<TData> (
  columns: TableColumn<TData>[],
  permissions: string[],
  profileType: string
): TableColumn<TData>[] 
{
  const result: TableColumn<TData>[] = [];
  columns.forEach(column => {
    if ((
      !column.permissionsRequired || 
      column.permissionsRequired.find((value) => permissions?.includes(value)))
    &&
    (
      !column.profileType ||
      column.profileType?.includes(profileType))
    ) 
    {
      result.push(column);
    }
  });
  return result;
}

export const createTitleForProfileTypes = (
  profileType: string,
  titleOverride: TitleOverride[] | undefined,
  generalTitle: string): string => 
{
  if (!titleOverride || !titleOverride.length) {
    return generalTitle;
  }
  return titleOverride.find((item) => Object.keys(item).includes(profileType))?.[profileType] || generalTitle;
}

export const createFormattedStringForDayjs = (value: string): string => {
  const arr = value.split('.');
  if(arr.length !== 3) {
    return value;
  }
  return `${arr[1]}.${arr[0]}.${arr[2]}`;
}

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
}

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
}
