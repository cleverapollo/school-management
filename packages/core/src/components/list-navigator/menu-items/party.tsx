import { Stack, Typography } from '@mui/material';
import { Person } from '@tyro/api';
import { Avatar, AvatarProps } from '../../avatar';

export type PartyListNavigatorMenuItemParams = {
  id: number;
  caption?: string;
  name: string;
  avatarProps?: AvatarProps;
} & (
  | Pick<Person, 'firstName' | 'lastName' | 'avatarUrl' | 'type'>
  | { type: 'group' }
);

export function PartyListNavigatorMenuItem({
  item,
}: {
  item: PartyListNavigatorMenuItemParams;
}) {
  const { avatarUrl, person } =
    item.type === 'group'
      ? {
          avatarUrl: undefined,
          person: undefined,
        }
      : {
          avatarUrl: item.avatarUrl,
          person: {
            firstName: item.firstName,
            lastName: item.lastName,
          },
        };

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Avatar
        src={avatarUrl}
        name={item.name}
        person={person}
        {...item.avatarProps}
        sx={{
          width: 32,
          height: 32,
          fontSize: '0.75rem',
          borderRadius: item.type === 'group' ? 1 : undefined,
          ...item.avatarProps?.sx,
        }}
      />
      <Stack>
        <Typography variant="subtitle2">{item.name}</Typography>
        {item?.caption && (
          <Typography variant="caption">{item?.caption}</Typography>
        )}
      </Stack>
    </Stack>
  );
}
