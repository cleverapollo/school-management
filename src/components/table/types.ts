import { AccessorFn, DeepKeys } from "@tanstack/react-table";
import { CellContext } from '@tanstack/react-table';
import { SyntheticEvent } from "react";

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
  tabs?: string[];
  onChangeTab?: (event: SyntheticEvent, newValue: string) => void;
  tabValue?: string;
}

export type FilterVariant = 'suggest' | 'date';

export interface Option {
  text: string;
  icon: string;
  action: () => void;
}
