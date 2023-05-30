import { useLoaderData } from 'react-router-dom';
import Sync from './sync';
import Login from './login';

type CredentialsStatusProps = {
  ppod_PPODCredentials: {
    lastSyncSuccessful: boolean;
  };
};

export default function Ppod() {
  const ppodCredentialsStatus = useLoaderData() as CredentialsStatusProps;
  const isPpodCredentialsSuccess =
    ppodCredentialsStatus?.ppod_PPODCredentials?.lastSyncSuccessful ?? false;

  return isPpodCredentialsSuccess ? <Sync /> : <Login />;
}
