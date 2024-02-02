import { Person } from '@tyro/api';
import { usePreferredNameLayout } from '../../../hooks';
import { TableAvatar, TableAvatarProps } from './table-avatar';

type TablePersonAvatarProps = Omit<TableAvatarProps, 'name'> & {
  person: Partial<Person> | undefined;
};

export function TablePersonAvatar({
  to,
  person,
  AvatarProps,
  hideAvatar,
  target,
}: TablePersonAvatarProps) {
  const { displayName } = usePreferredNameLayout();
  const name = displayName(person);

  return (
    <TableAvatar
      to={to}
      name={name}
      avatarUrl={person?.avatarUrl}
      AvatarProps={{ ...AvatarProps, person }}
      hideAvatar={hideAvatar}
      target={target}
    />
  );
}
