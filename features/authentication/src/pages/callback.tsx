/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '@tyro/api';
import LoadingScreen from '../../../../src/components/LoadingScreen';

export default function Callback() {
  const navigate = useNavigate();
  const { activeProfile } = useUser();

  useEffect(() => {
    if (activeProfile !== null) {
      navigate('/');
    }
  }, [navigate, activeProfile]);

  return <LoadingScreen />;
}
