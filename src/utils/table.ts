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
