import { Card, Stack, CardHeader, Button } from '@mui/material';
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

export function ContactForm() {
  const { t } = useTranslation(['common', 'people']);

  const navigate = useNavigate();

  const { mutate: createContactMutation, isLoading } = useCreateContact();

  const { resolver, rules } = useFormValidator<ContactFormState>();
  const { control, handleSubmit, setValue, getValues } =
    useForm<ContactFormState>({
      defaultValues: {
        studentRelationships: [{}],
      },
      resolver: resolver({
        firstName: rules.required(),
        surname: rules.required(),
        email: rules.isEmail(),
        mobileNumber: rules.validate<ContactFormState['mobileNumber']>(
          (mobileNumber, throwError) => {
            if (mobileNumber?.number && !mobileNumber.numberMatchWithMask) {
              throwError(t('common:errorMessages.invalidMobileNumber'));
            }
          }
        ),
        studentRelationships: {
          priority: rules.required(),
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
    city,
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
        ...(mobileNumber && {
          phoneNumbers: [
            {
              primaryPhoneNumber: true,
              active: true,
              number: mobileNumber.number,
              countryCode: mobileNumber.countryCode,
            },
          ],
        }),
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
          ({ student, priority, ...restData }) => ({
            ...restData,
            studentPartyId: student.partyId,
            priority: Number(priority),
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

  const cardStyle = {
    p: 3,
    pt: 2.25,
    pb: 1.25,
    m: 0,
    borderBottom: '1px solid',
    borderColor: 'divider',
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3}>
      <Card variant="outlined">
        <CardHeader
          component="h2"
          title={t('people:personalInformation')}
          sx={cardStyle}
        />
        <Stack direction="column" gap={3} p={3}>
          <PersonalInformation control={control} />
          <PrimaryAddress control={control} />
        </Stack>
      </Card>
      <Card variant="outlined">
        <CardHeader
          component="h2"
          title={t('people:studentRelationships')}
          sx={cardStyle}
        />
        <Stack direction="column" p={3}>
          <StudentRelationships
            setValue={setValue}
            getValues={getValues}
            control={control}
          />
        </Stack>
      </Card>
      <Stack direction="row" gap={2} justifyContent="flex-end">
        <Button
          variant="soft"
          size="large"
          color="primary"
          onClick={() => navigate('/people/contacts')}
        >
          {t('common:actions.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          size="large"
          type="submit"
          loading={isLoading}
        >
          {t('people:createContact')}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
