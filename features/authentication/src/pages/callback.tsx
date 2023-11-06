import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '@tyro/api';
import { LoadingScreen } from '@tyro/core';

export default function Callback() {
  const navigate = useNavigate();
  const { activeProfile, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      navigate(activeProfile ? '/' : '/login');
    }
  }, [navigate, activeProfile, isLoading]);

  return <LoadingScreen />;
}
