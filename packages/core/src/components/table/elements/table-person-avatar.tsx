import { Person } from '@tyro/api';
import { usePreferredNameLayout } from '../../../hooks';
import { TableAvatar } from './table-avatar';

type TablePersonAvatarProps = {
  to?: string | null;
  person: Partial<Person> | undefined;
};

export function TablePersonAvatar({ to, person }: TablePersonAvatarProps) {
  const { displayName } = usePreferredNameLayout();
  const name = displayName(person);

  return <TableAvatar to={to} name={name} avatarUrl={person?.avatarUrl} />;
}
