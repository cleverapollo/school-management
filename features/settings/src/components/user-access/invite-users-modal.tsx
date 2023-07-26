import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UserType } from '@tyro/api';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useLocation } from 'react-router';
import { ReturnTypeFromUseUserAccess } from '../../api/user-access/user-access';
import { useInviteUsers } from '../../api/user-access/invite-users';
import {
  useUserTypeFromPathname,
  OriginPath,
} from '../../utils/get-user-type-from-pathname';

type InviteUsersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipients?: ReturnTypeFromUseUserAccess[];
};

export function InviteUsersModal({
  isOpen,
  onClose,
  recipients,
}: InviteUsersModalProps) {
  const { t } = useTranslation(['common', 'settings']);
  const userType = useUserTypeFromPathname(OriginPath.modal) as UserType;

  const {
    mutate: inviteUsers,
    isLoading: isSubmitting,
    data: response,
  } = useInviteUsers();

  const [showError, setShowError] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const onCancel = () => {
    setShowError(false);
    setSubmittedSuccessfully(false);
    onClose();
  };

  useEffect(() => {
    if (
      submittedSuccessfully &&
      response?.users_inviteUsers?.validations?.length
    ) {
      setShowError(true);
    } else if (submittedSuccessfully && !showError) {
      onCancel();
    }
  }, [submittedSuccessfully, response]);

  const { handleSubmit } = useForm();

  const onSubmit = handleSubmit(() => {
    const data = recipients?.map((recipient) => ({
      personPartyId: recipient.personPartyId,
      givenName: recipient.personalInfo?.firstName,
      surname: recipient.personalInfo?.lastName,
      email: recipient.personalInfo?.primaryEmail?.email ?? '',
      userType,
      resend: true,
    }));

    if (Array.isArray(data)) {
      inviteUsers(data, {
        onSuccess: () => {
          setSubmittedSuccessfully(true);
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('settings:inviteUsers')}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          {showError && (
            <Collapse in>
              <Alert severity="error" sx={{ alignItems: 'center' }}>
                {response?.users_inviteUsers?.validations?.map((error) => (
                  <Typography component="dd" variant="body2">
                    {t('settings:accountExistsWithEmail', {
                      error,
                    })}
                  </Typography>
                ))}
              </Alert>
            </Collapse>
          )}
          {!showError && !submittedSuccessfully && (
            <>
              <Typography component="dd" variant="body1" mb={2}>
                {t('settings:inviteUsersConfirmation', {
                  count: recipients?.length,
                })}
              </Typography>

              {recipients?.map((recipient) => (
                <Typography component="dd" variant="body2">
                  {recipient.personalInfo?.firstName}{' '}
                  {recipient.personalInfo?.lastName}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onCancel}>
            {t('common:actions.cancel')}
          </Button>
          {!showError && !submittedSuccessfully && (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {t('settings:sendInvite')}
            </LoadingButton>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
