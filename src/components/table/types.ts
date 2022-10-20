import { AccessorFn, DeepKeys } from "@tanstack/table-core";
import { ReactNode } from "react";

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
  component: (value: string) => ReactNode;
  fieldName: DeepKeys<TData> | AccessorFn<TData>;
  filter?: FilterVariant;
}

export interface ITableProps<TData> {
  data: TData[];
  title: string;
  titleOverride?: TitleOverride[];
  columns: TableColumn<TData>[];
}

export type FilterVariant = 'suggest' | 'date';
