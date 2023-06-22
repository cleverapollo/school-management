import { Card, CardHeader, Stack } from '@mui/material';
import { RHFTextField, useFormValidator } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from '@tyro/i18n';

import { useSavePpodCredentials } from '../../api/ppod/ppod-login';

type FormValues = {
  username: string;
  password: string;
};

export default function PpodLogin() {
  const { t } = useTranslation(['common', 'settings']);
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
          navigate('/settings/ppod/sync', { replace: true });
        },
        onError: () => {
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
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={3}
        p={3}
        alignItems={{ sm: 'center' }}
      >
        <RHFTextField
          label={t('settings:ppodSync.username')}
          controlProps={{
            name: 'username',
            control,
          }}
        />

        <RHFTextField
          label={t('settings:ppodSync.password')}
          textFieldProps={{ type: 'password' }}
          controlProps={{
            name: 'password',
            control,
          }}
        />

        <LoadingButton
          variant="contained"
          size="large"
          type="submit"
          loading={isLoading}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {t('settings:ppodSync.login')}
        </LoadingButton>
      </Stack>
    </Card>
  );
}
