import { CustomGroupForm } from '../../components/custom-group/form';
import { CustomGroupFormContainer } from '../../components/custom-group/form/container';

export default function CreateCustomGroupPage() {
  return (
    <CustomGroupFormContainer mode="create">
      <CustomGroupForm />
    </CustomGroupFormContainer>
  );
}
