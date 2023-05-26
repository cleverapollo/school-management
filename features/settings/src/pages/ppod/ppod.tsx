// eslint-disable-next-line import/no-extraneous-dependencies
import { useLoaderData } from 'react-router-dom';
import Sync from './sync';
import Login from './login';

type CredentialStatusProps = {
  ppod_PPODCredentials: {
    lastSyncSuccessful: boolean;
  };
};

export default function Ppod() {
  const ppodCredentialsStatus = useLoaderData() as CredentialStatusProps;

  return !ppodCredentialsStatus?.ppod_PPODCredentials?.lastSyncSuccessful ? (
    <Login />
  ) : (
    <Sync />
  );
}
