// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// components
import { FormProvider } from '../../../../components/hook-form';
import { useAuth } from '@tyro/api';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function LoginForm() {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await login();
    } catch (error) {
      console.error(error);

      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login with MSAL
      </LoadingButton>
    </FormProvider>
  );
}
