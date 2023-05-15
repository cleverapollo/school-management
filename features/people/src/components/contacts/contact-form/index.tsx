import { Card, Stack, CardHeader, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { RHFSwitch, RHFTextField, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  PersonalInformation,
  InputPhoneNumber,
  InputEmailAddress,
  InputAddress,
} from '@tyro/api';
import {
  StudentRelationships,
  StudentRelationshipsFormState,
} from './student-relationships';
import { useCreateContact } from '../../../api/contact/create-contact';

type ContactFormState = {
  firstName: PersonalInformation['firstName'];
  surname: PersonalInformation['lastName'];
  mobileNumber: InputPhoneNumber['number'];
  email: InputEmailAddress['email'];
  addressLine1: InputAddress['line1'];
  addressLine2: InputAddress['line2'];
  addressLine3: InputAddress['line3'];
  county: InputAddress['city'];
  country: InputAddress['country'];
  eircode: InputAddress['postCode'];
  spokenLanguage: string;
  requiresInterpreter: boolean;
} & StudentRelationshipsFormState;

type ContactFormProp = {
  title: string;
  ctaText: string;
  contactFormData?: Partial<ContactFormState>;
};

export function ContactForm({
  title,
  ctaText,
  contactFormData,
}: ContactFormProp) {
  const { t } = useTranslation(['people']);
  const navigate = useNavigate();

  const { mutate: createContactMutation, isLoading } = useCreateContact();

  const { resolver, rules } = useFormValidator<ContactFormState>();
  const { control, handleSubmit } = useForm<ContactFormState>({
    defaultValues: {
      studentRelationships: [
        {
          relationshipType: null,
          student: null,
        },
      ],
      ...contactFormData,
    },
    resolver: resolver({
      firstName: rules.required(),
      surname: rules.required(),
      studentRelationships: {
        relationshipType: rules.required(),
        student: rules.required(),
      },
    }),
  });

  const onSubmit = ({
    firstName,
    surname: lastName,
    mobileNumber,
    email,
    addressLine1: line1,
    addressLine2: line2,
    addressLine3: line3,
    eircode: postCode,
    county: city,
    country,
    spokenLanguage: nativeLanguage,
    requiresInterpreter,
    studentRelationships,
  }: ContactFormState) => {
    createContactMutation(
      {
        personal: {
          firstName,
          lastName,
        },
        phoneNumbers: [
          {
            primaryPhoneNumber: true,
            active: true,
            number: mobileNumber,
          },
        ],
        emails: [
          {
            primaryEmail: true,
            active: true,
            email,
          },
        ],
        addresses: [
          {
            primaryAddress: true,
            active: true,
            city,
            country,
            line1,
            line2,
            line3,
            postCode,
          },
        ],
        nativeLanguage,
        requiresInterpreter,
        studentRelationships: studentRelationships.map(
          ({ relationshipType, student }) => ({
            primaryContact: false,
            allowedToContact: true,
            includeInSms: true,
            relationshipType: relationshipType!,
            studentPartyId: student?.partyId ?? 0,
          })
        ),
      },
      {
        onSuccess: () => {
          navigate('/people/contacts');
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return (
    <Card variant="outlined" component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardHeader
        component="h2"
        title={title}
        sx={{
          p: 3,
          pt: 2.25,
          pb: 1.25,
          m: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Stack direction="column" gap={3} p={3}>
        <Typography
          variant="body1"
          component="h3"
          color="text.secondary"
          fontWeight={600}
        >
          {t('people:contactForm.personalInformation')}
        </Typography>
        <Stack direction="row" gap={2}>
          <RHFTextField
            label={t('people:contactForm.labels.firstName')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'firstName',
              control,
            }}
          />
          <RHFTextField
            label={t('people:contactForm.labels.surname')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'surname',
              control,
            }}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <RHFTextField
            label={t('people:contactForm.labels.mobileNumber')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'mobileNumber',
              control,
            }}
          />
          <RHFTextField
            label={t('people:contactForm.labels.email')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'email',
              control,
            }}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <RHFTextField
            label={t('people:contactForm.labels.addressLine1')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'addressLine1',
              control,
            }}
          />
          <RHFTextField
            label={t('people:contactForm.labels.addressLine2')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'addressLine2',
              control,
            }}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <RHFTextField
            label={t('people:contactForm.labels.addressLine3')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'addressLine3',
              control,
            }}
          />
          <RHFTextField
            label={t('people:contactForm.labels.county')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'county',
              control,
            }}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <RHFTextField
            label={t('people:contactForm.labels.eircode')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'eircode',
              control,
            }}
          />
          <RHFTextField
            label={t('people:contactForm.labels.country')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'country',
              control,
            }}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <RHFTextField
            label={t('people:contactForm.labels.spokenLanguage')}
            textFieldProps={{ fullWidth: true }}
            controlProps={{
              name: 'spokenLanguage',
              control,
            }}
          />
          <RHFSwitch
            label={t('people:contactForm.labels.requiresInterpreter')}
            controlLabelProps={{ sx: { width: '100%' } }}
            switchProps={{ color: 'primary' }}
            controlProps={{ name: 'requiresInterpreter', control }}
          />
        </Stack>
        <StudentRelationships control={control} />
        <Stack alignItems="flex-end">
          <LoadingButton
            variant="contained"
            size="large"
            type="submit"
            loading={isLoading}
          >
            {ctaText}
          </LoadingButton>
        </Stack>
      </Stack>
    </Card>
  );
}
