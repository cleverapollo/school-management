import { Card, Stack, CardHeader } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  StudentRelationships,
  StudentRelationshipsFormState,
} from './student-relationships';
import { useCreateContact } from '../../../api/contact/create-contact';
import { PrimaryAddress, PrimaryAddressFormState } from './primary-address';
import {
  PersonalInformation,
  PersonalInformationFormState,
} from './personal-information';

type ContactFormState = PersonalInformationFormState &
  PrimaryAddressFormState &
  StudentRelationshipsFormState;

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
        <PersonalInformation control={control} />
        <PrimaryAddress control={control} />
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
