import { Card, Stack, CardHeader, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ConfirmDialog, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  StudentRelationships,
  StudentRelationshipsFormState,
} from './student-relationships';
import { useUpsertContact } from '../../../api/contact/upsert-contact';
import {
  PrimaryAddress,
  PrimaryAddressFormState,
} from '../../common/primary-address';
import {
  PersonalInformation,
  PersonalInformationFormState,
} from './personal-information';
import { StudentSelectOption } from '../../../api/student/students';

type ContactFormState = PersonalInformationFormState &
  PrimaryAddressFormState &
  StudentRelationshipsFormState;

export function ContactForm() {
  const { t } = useTranslation(['common', 'people']);
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const location = useLocation();

  const { mutate: upsertContactMutation, isLoading } = useUpsertContact();

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
      mobileNumber: rules.isPhoneNumber(
        t('common:errorMessages.invalidMobileNumber')
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
    spokenLanguage,
    requiresInterpreter,
    studentRelationships,
  }: ContactFormState) => {
    const hasAddress = city || country || line1 || line2 || line3 || postCode;

    upsertContactMutation(
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
        ...(spokenLanguage && {
          spokenLanguages: [spokenLanguage],
        }),
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

  useEffect(() => {
    const { students } = (location?.state ?? { students: [] }) as {
      students: StudentSelectOption[];
    };
    if (Array.isArray(students) && students.length > 0) {
      students.forEach((student, index) => {
        setValue(`studentRelationships.${index}.student`, student);
      });
    }
  }, [location]);

  return (
    <>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3}>
        <Card variant="outlined">
          <CardHeader
            component="h2"
            title={t('people:contactPersonalInformation')}
          />
          <Stack direction="column" gap={3} p={3}>
            <PersonalInformation control={control} />
            <PrimaryAddress control={control} />
          </Stack>
        </Card>
        <Card variant="outlined">
          <CardHeader component="h2" title={t('people:studentRelationships')} />
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
