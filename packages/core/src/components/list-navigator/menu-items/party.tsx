import { Stack, Typography } from '@mui/material';
import { Person } from '@tyro/api';
import { Avatar, AvatarProps } from '../../avatar';

export type PartyListNavigatorMenuItemParams = {
  id: number;
  caption?: string;
  name: string;
  avatarProps?: AvatarProps;
} & (
  | ({
      type: 'person';
    } & Pick<Person, 'firstName' | 'lastName' | 'avatarUrl'>)
  | {
      type: 'group';
    }
);

export function PartyListNavigatorMenuItem({
  item,
}: {
  item: PartyListNavigatorMenuItemParams;
}) {
  const { avatarUrl, person } =
    item.type === 'person'
      ? {
          avatarUrl: item.avatarUrl,
          person: {
            firstName: item.firstName,
            lastName: item.lastName,
          },
        }
      : {
          avatarUrl: undefined,
          person: undefined,
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
