import { usePpodCredentialsStatus } from '../../api/ppod/ppod-credentials-status';
import Sync from './sync';
import Login from './login';

export default function Ppod() {
  const { data: ppodCredentialsStatus } = usePpodCredentialsStatus();

  return ppodCredentialsStatus ? <Sync /> : <Login />;
}
