import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@tyro/core';
import { useAuth } from '@tyro/api';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import { Button } from '@mui/material';
import { useIdleTracker } from '../hooks/use-idle-tracker';

export function IdleModal() {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const { t } = useTranslation(['common']);

  const { isIdle, isPastIdle, resetActivity } = useIdleTracker(30);
  const { logout } = useAuth();
  const timerRef = useRef<NodeJS.Timeout>();
  const [countDown, setCountDown] = useState(60);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
      setCountDown(60);
    }
  };

  const onClose = () => {
    resetActivity();
    clearTimer();
  };

  useEffect(() => {
    if (isPastIdle) {
      logout();
    } else if (isIdle) {
      timerRef.current = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 0) {
            onClose();
            logout();
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
      return () => clearTimer();
    }
  }, [isIdle, isPastIdle]);

  return (
    <Dialog
      open={isIdle}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId} onClose={onClose}>
        {t('common:helloAnyoneHome')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          {t('common:itLooksLikeYouveBeenIdle', { count: countDown })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={logout}>
          {t('common:actions.logMeOut')}
        </Button>
        <Button variant="soft" onClick={onClose}>
          {t('common:actions.stayLoggedIn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
