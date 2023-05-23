import { Card, Stack, CardHeader, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ConfirmDialog, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

const cardHeaderStyle = {
  p: 3,
  pt: 2.25,
  pb: 1.25,
  m: 0,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export function ContactForm() {
  const { t } = useTranslation(['common', 'people']);
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { mutate: createContactMutation, isLoading } = useCreateContact();

  const { resolver, rules } = useFormValidator<ContactFormState>();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<ContactFormState>({
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

  const goBack = () => {
    navigate('/people/contacts');
  };

  const handleCancelForm = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      goBack();
    }
  };

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
    const hasAddress = city || country || line1 || line2 || line3 || postCode;

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
        ...(email && {
          emails: [
            {
              primaryEmail: true,
              active: true,
              email,
            },
          ],
        }),
        ...(hasAddress && {
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
        }),
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
        onSuccess: goBack,
      }
    );
  };

  return (
    <>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3}>
        <Card variant="outlined">
          <CardHeader
            component="h2"
            title={t('people:personalInformation')}
            sx={cardHeaderStyle}
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
            sx={cardHeaderStyle}
          />
          <Stack direction="column" p={3}>
            <StudentRelationships setValue={setValue} control={control} />
          </Stack>
        </Card>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button
            variant="soft"
            size="large"
            color="primary"
            onClick={handleCancelForm}
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
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={goBack}
      />
    </>
  );
}
