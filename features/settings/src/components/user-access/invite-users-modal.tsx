import { useEffect, useState } from 'react';
import { Alert, AlertTitle, Button, Collapse, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { LoadingButton } from '@mui/lab';
import { UserType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
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

  const handleSubmit = () => {
    const data = recipients?.map((recipient) => {
      const resendStatus = Boolean(recipient?.status === 'INVITE_SENT');

      return {
        personPartyId: recipient.personPartyId,
        givenName: recipient.personalInfo?.firstName,
        surname: recipient.personalInfo?.lastName,
        email: recipient.personalInfo?.primaryEmail?.email ?? '',
        userType,
        resend: resendStatus,
      };
    });

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
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle onClose={onClose}>{t('settings:inviteUsers')}</DialogTitle>
      <DialogContent>
        {showError && (
          <Collapse in>
            {response?.users_inviteUsers?.validations?.map((error) => (
              <Alert severity="error" sx={{ alignItems: 'top' }}>
                <AlertTitle> {error?.message}</AlertTitle>

                {error?.associatedUsers?.map((user) => (
                  <Typography component="dd" variant="body2">
                    {user}
                  </Typography>
                ))}
              </Alert>
            ))}
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
            onClick={handleSubmit}
          >
            {t('settings:sendInvite')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
