import { Card, CardHeader, Stack } from '@mui/material';
import { RHFTextField, useFormValidator, useToast } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { queryClient } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

import { useSavePpodCredentials, ppodSyncKeys } from '../../api/ppod';

type FormValues = {
  username: string;
  password: string;
};

export default function PpodLogin() {
  const { t } = useTranslation(['common', 'settings']);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutate: savePpodCredentials, isLoading } = useSavePpodCredentials();

  const { resolver, rules } = useFormValidator<FormValues>();

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: resolver({
      username: rules.required(),
      password: rules.required(),
    }),
  });

  const onSubmit = ({ username, password }: FormValues) => {
    savePpodCredentials(
      {
        username,
        password,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...ppodSyncKeys.all],
          });
          toast(t('common:snackbarMessages.credentialsCorrect'));
          navigate('./sync-data/sync');
        },
        onError: () => {
          toast(t('common:snackbarMessages.incorrectCredentials'), {
            variant: 'error',
          });
          reset();
        },
      }
    );
  };

  return (
    <Card variant="outlined" component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardHeader
        component="h2"
        title={t('settings:ppodSync.enterPpodCredentials')}
        sx={{
          p: 3,
          pt: 2.25,
          pb: 1.25,
          m: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} p={3}>
        <Stack direction="column" gap={2.5}>
          <RHFTextField
            label={t('settings:ppodSync.username')}
            textFieldProps={{
              minRows: 1,
            }}
            controlProps={{
              name: 'username',
              control,
            }}
          />
        </Stack>

        <Stack direction="column" gap={2.5}>
          <RHFTextField
            label={t('settings:ppodSync.password')}
            type="password"
            textFieldProps={{
              minRows: 1,
            }}
            controlProps={{
              name: 'password',
              control,
            }}
          />
        </Stack>

        <Stack alignItems="flex-end" justifyContent="center">
          <LoadingButton
            variant="contained"
            size="large"
            type="submit"
            loading={isLoading}
            sx={{ width: { xs: '100%' } }}
          >
            {t('settings:ppodSync.login')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );
}
