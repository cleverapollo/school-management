import { Person } from '@tyro/api';
import { usePreferredNameLayout } from '../../../hooks';
import { AvatarProps as CoreAvatarProps } from '../../avatar';
import { TableAvatar } from './table-avatar';

type TablePersonAvatarProps = {
  to?: string | null;
  person: Partial<Person> | undefined;
  AvatarProps?: CoreAvatarProps;
};

export function TablePersonAvatar({
  to,
  person,
  AvatarProps,
}: TablePersonAvatarProps) {
  const { displayName } = usePreferredNameLayout();
  const name = displayName(person);

  return (
    <TableAvatar
      to={to}
      name={name}
      avatarUrl={person?.avatarUrl}
      AvatarProps={{ ...AvatarProps, person }}
    />
  );
}
