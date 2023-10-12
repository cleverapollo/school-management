import { useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RHFSelect,
  RHFTextField,
  useFormValidator,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { PersonalTitle, StudentMedicalContact } from '@tyro/api';
import { useCreateOrUpdateMedicalProfessional } from '../../../api/student/medicals/upsert-medical-professional';

export type UpsertMedicalProfessionalFormState = Pick<
  StudentMedicalContact,
  | 'id'
  | 'personalTitleId'
  | 'personalTitle'
  | 'firstName'
  | 'lastName'
  | 'addressLine1'
  | 'addressLine2'
  | 'addressLine3'
  | 'county'
  | 'postcode'
  | 'email'
  | 'primaryPhone'
  | 'occupation'
>;

export type PersonalTitlesProps = Pick<PersonalTitle, 'id' | 'name'>;

export type ManageSiblingModalProps = {
  open: boolean;
  onClose: () => void;
  studentId: number | undefined;
  medicalContact: Partial<UpsertMedicalProfessionalFormState> | null;
  personalTitles?: PersonalTitlesProps[];
};

export function UpsertMedicalProfessionalModal({
  open,
  onClose,
  studentId,
  medicalContact,
  personalTitles,
}: ManageSiblingModalProps) {
  const { t } = useTranslation(['common', 'people']);

  const { mutate: createOrUpdateMedicalContact, isLoading: isSubmitting } =
    useCreateOrUpdateMedicalProfessional();

  const { resolver, rules } =
    useFormValidator<UpsertMedicalProfessionalFormState>();

  const { reset, handleSubmit, control } =
    useForm<UpsertMedicalProfessionalFormState>({
      resolver: resolver({
        personalTitle: [rules.required()],
        firstName: [rules.required()],
        lastName: [rules.required()],
        occupation: [rules.required()],
        addressLine1: [rules.required()],
        county: [rules.required()],
        postcode: [rules.required()],
        primaryPhone: [rules.required()],
        email: [rules.required()],
      }),
    });

  const onSubmit = handleSubmit(({ ...restData }) => {
    const titleSelected = personalTitles?.find(
      (title) => title.name === restData.personalTitle
    );

    const transformedData = {
      ...restData,
      personalTitleId: titleSelected?.id,
      studentPartyId: studentId ?? 0,
    };

    createOrUpdateMedicalContact(transformedData, { onSuccess: onClose });
  });

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    reset(medicalContact ?? {});
  }, [medicalContact]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle onClose={onClose}>
        {medicalContact?.id
          ? t('people:editMedicalProfessional')
          : t('people:addMedicalProfessional')}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack gap={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ mt: 1 }}
            >
              <RHFSelect<
                UpsertMedicalProfessionalFormState,
                PersonalTitlesProps
              >
                label={t('people:title')}
                fullWidth
                options={personalTitles ?? []}
                getOptionLabel={(option) => option?.name}
                optionIdKey="name"
                controlProps={{
                  name: 'personalTitle',
                  control,
                }}
              />
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:firstName')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'firstName',
                  control,
                }}
              />
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:lastName')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'lastName',
                  control,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.occupation')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'occupation',
                  control,
                }}
              />
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.addressLine1')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'addressLine1',
                  control,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.addressLine2')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'addressLine2',
                  control,
                }}
              />
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.addressLine3')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'addressLine3',
                  control,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.city')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'county',
                  control,
                }}
              />
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.eircode')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'postcode',
                  control,
                }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.primaryNumber')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'primaryPhone',
                  control,
                }}
              />
              <RHFTextField<UpsertMedicalProfessionalFormState>
                label={t('people:personal.about.email')}
                textFieldProps={{ fullWidth: true }}
                controlProps={{
                  name: 'email',
                  control,
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
