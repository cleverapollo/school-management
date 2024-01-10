import { FeeContainer } from '../../components/fees/container';
import { FeeForm } from '../../components/fees/form';

export default function CreateFeePage() {
  return (
    <FeeContainer mode="create">
      <FeeForm />
    </FeeContainer>
  );
}
