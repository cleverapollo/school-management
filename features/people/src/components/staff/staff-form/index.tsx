import { Card, Stack, CardHeader, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ConfirmDialog, useDisclosure, useFormValidator } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  PersonalInformation,
  PersonalInformationFormState,
} from './personal-information';
import {
  PrimaryAddress,
  PrimaryAddressFormState,
} from '../../common/primary-address';
import { NextOfKin, NextOfKinFormState } from './next-of-kin';
import { useCreateStaff } from '../../../api/staff/create-staff';
import {
  EmploymentInformation,
  EmploymentInformationFormState,
} from './employment-information';

type StaffFormState = PersonalInformationFormState &
  EmploymentInformationFormState &
  PrimaryAddressFormState &
  NextOfKinFormState;

export function StaffForm() {
  const { t } = useTranslation(['common', 'people']);
  const navigate = useNavigate();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onOpenCancelModal,
    onClose: onCloseCancelModal,
  } = useDisclosure();

  const { mutate: createStaffMutation, isLoading } = useCreateStaff();

  const { resolver, rules } = useFormValidator<StaffFormState>();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<StaffFormState>({
    resolver: resolver({
      firstName: rules.required(),
      lastName: rules.required(),
      email: rules.isEmail(),
      employmentCapacity: rules.required(),
      mobileNumber: rules.isPhoneNumber(
        t('common:errorMessages.invalidMobileNumber')
      ),
      additionalNumber: rules.isPhoneNumber(),
      startDate: rules.date(),
      nextOfKinPhoneNumber: rules.isPhoneNumber(),
      nextOfKinAdditionalNumber: rules.isPhoneNumber(),
    }),
  });

  const goBack = () => {
    navigate('/people/staff');
  };

  const handleCancelForm = () => {
    if (isDirty) {
      onOpenCancelModal();
    } else {
      goBack();
    }
  };

  const onSubmit = ({
    title,
    startDate,
    mobileNumber,
    additionalNumber,
    email,
    addressLine1: line1,
    addressLine2: line2,
    addressLine3: line3,
    eircode: postCode,
    city,
    country,
    nextOfKinFirstName,
    nextOfKinSurname,
    nextOfKinPhoneNumber,
    nextOfKinAdditionalNumber,
    ...data
  }: StaffFormState) => {
    const hasAddress = city || country || line1 || line2 || line3 || postCode;
    const hasNextOfKin = nextOfKinFirstName || nextOfKinSurname;
    const nextOfKinPhoneNumbers = [
      nextOfKinPhoneNumber,
      nextOfKinAdditionalNumber,
    ].filter(Boolean);

    createStaffMutation(
      [
        {
          ...data,
          titleId: title?.id,
          startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
          phoneNumbers: [
            ...(mobileNumber
              ? [
                  {
                    primaryPhoneNumber: true,
                    active: true,
                    number: mobileNumber.number,
                    countryCode: mobileNumber.countryCode,
                  },
                ]
              : []),
            ...(additionalNumber
              ? [
                  {
                    primaryPhoneNumber: false,
                    active: true,
                    number: additionalNumber,
                  },
                ]
              : []),
          ],
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
          ...(hasNextOfKin && {
            nextOfKin: {
              firstName: nextOfKinFirstName,
              lastName: nextOfKinSurname,
              phoneNumbers: nextOfKinPhoneNumbers,
            },
          }),
          noLongerStaff: false,
        },
      ],
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
            title={t('people:staffPersonalInformation')}
          />
          <Stack direction="column" gap={3} p={3}>
            <PersonalInformation control={control} />
            <EmploymentInformation control={control} />
            <PrimaryAddress control={control} />
            <NextOfKin control={control} />
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
            {t('people:createStaff')}
          </LoadingButton>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={onCloseCancelModal}
        onConfirm={goBack}
      />
    </>
  );
}
