import { Stack, Typography } from '@mui/material';

export type BasicListNavigatorMenuItemParams = {
  id: number;
  caption?: string;
  name: string;
};

export function BasicListNavigatorMenuItem({
  item,
}: {
  item: BasicListNavigatorMenuItemParams;
}) {
  return (
    <Stack>
      <Typography variant="subtitle2">{item.name}</Typography>
      {item?.caption && (
        <Typography variant="caption">{item?.caption}</Typography>
      )}
    </Stack>
  );
}
