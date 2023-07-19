import { PermissionForm } from '../../components/permissions/permission-form';
import { PermissionContainer } from '../../components/permissions/container';

export default function CreatePermissionPage() {
  return (
    <PermissionContainer mode="create">
      <PermissionForm />
    </PermissionContainer>
  );
}
