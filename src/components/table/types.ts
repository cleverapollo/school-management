import { AccessorFn, DeepKeys } from "@tanstack/table-core";
import { CellContext } from '@tanstack/react-table';

export interface Config {
}

export interface TitleOverride {
  [key: string]: string; //ToDo: change key to profileType type
}

export interface TableColumn<TData> {
  columnDisplayName: string;
  config?: Config;
  permissionsRequired?: string[];
  profileType?: string[];
  component?: (props: CellContext<TData, unknown>) => any;
  fieldName: DeepKeys<TData> | AccessorFn<TData>;
  filter?: FilterVariant;
  isMandatory?: boolean;
}

export interface ITableProps<TData> {
  data: TData[];
  title: string;
  titleOverride?: TitleOverride[];
  columns: TableColumn<TData>[];
}

export type FilterVariant = 'suggest' | 'date';
