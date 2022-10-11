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
  valueIdentifier: (data: TData) => string;
  component: (value: string) => ReactNode;
}

export interface ITableProps<TData> {
  data: TData[];
  title: string;
  titleOverride?: TitleOverride[];
  columns: TableColumn<TData>[];
}