import { AccessorFn, DeepKeys } from "@tanstack/table-core";
import { CellContext } from '@tanstack/react-table';
import { SyntheticEvent } from "react";
import { GROUP_TYPES } from "./constants";

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
  isSortNeeded?: boolean;
}

export interface ITableProps<TData> {
  data: TData[];
  title: string;
  titleOverride?: TitleOverride[];
  story?: string[];
  columns: TableColumn<TData>[];
  tabs?: string[];
  onChangeTab?: (event: SyntheticEvent, newValue: string) => void;
  tabValue?: string;
  onClickRow?: (data: any) => void;
  isRowSelectionNeeded?: boolean;
}

export type FilterVariant = 'suggest' | 'date';

export interface Option {
  text: string;
  icon: string;
  action: () => void;
}

export type GroupTypes = GROUP_TYPES.ENROLMENT | GROUP_TYPES.SUBJECT | GROUP_TYPES.CUSTOM;
