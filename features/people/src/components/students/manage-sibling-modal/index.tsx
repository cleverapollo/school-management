import { Box, Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { AnimatePresence, m, Variants } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@tyro/icons';
import { SiblingSelect } from './sibling-select';
import { NewContactSelect } from './new-contact-select';
import { useStudentsContacts } from '../../../api/student/overview';
import { ManageSiblingFormValues, ManageSiblingModalProps } from './types';
import { useUpdateSiblingsAndContacts } from '../../../api/student/update-siblings-and-contacts';

const animationVariants: Variants = {
  enter: (step: number) => ({
    x: step === 2 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
  }),
  center: {
    x: '0%',
    opacity: 1,
    position: 'relative',
  },
  exit: (step: number) => ({
    x: step === 2 ? '-100%' : '100%',
    opacity: 0,
    position: 'absolute',
  }),
};

export function ManageSiblingModal({
  open,
  onClose,
  currentStudent,
  currentSiblings,
}: ManageSiblingModalProps) {
  const { t } = useTranslation(['common', 'timetable', 'people']);
  const [step, setStep] = useState(1);
  const { data: studentsCurrentContact } = useStudentsContacts(
    currentStudent.partyId,
    open
  );
  const { mutateAsync: updateSiblingsAndContacts, isLoading } =
    useUpdateSiblingsAndContacts();

  const { reset, handleSubmit, setValue, control, watch } =
    useForm<ManageSiblingFormValues>({
      defaultValues: {
        enrolledSiblings: currentSiblings?.enrolledSiblings ?? [],
        nonEnrolledSiblings: currentSiblings?.nonEnrolledSiblings ?? [],
        newContacts: {},
      },
    });

  const closeAndResetModal = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
    }, 300);
  };

  const [enrolledSiblings, nonEnrolledSiblings, newContacts] = watch([
    'enrolledSiblings',
    'nonEnrolledSiblings',
    'newContacts',
  ]);

  const additionalContacts = useMemo(() => {
    const currentSiblingIds = new Set(
      currentSiblings.enrolledSiblings.map(({ partyId }) => partyId)
    );
    const newSiblings = enrolledSiblings.filter(
      (sibling) => !currentSiblingIds.has(sibling.partyId)
    );
    const addedContactIds = new Set();
    return newSiblings.reduce<
      NonNullable<(typeof newSiblings)[number]['contacts']>
    >((acc, sibling) => {
      if (sibling?.contacts) {
        sibling.contacts.forEach((contact) => {
          if (!addedContactIds.has(contact.partyId)) {
            acc.push(contact);
            addedContactIds.add(contact.partyId);
          }
        });
      }
      return acc;
    }, []);
  }, [
    enrolledSiblings,
    studentsCurrentContact,
    currentSiblings.enrolledSiblings,
  ]);

  const onSubmit = handleSubmit((data) => {
    const selectedSiblings = [
      ...data.enrolledSiblings,
      ...data.nonEnrolledSiblings,
    ].map(({ partyId }) => partyId);
    const originalSiblings = [
      ...currentSiblings.enrolledSiblings,
      ...currentSiblings.nonEnrolledSiblings,
    ].map(({ partyId }) => partyId);

    const linkSiblings = selectedSiblings.filter(
      (partyId) => !originalSiblings.includes(partyId)
    );
    const unlinkSiblings = originalSiblings.filter(
      (partyId) => !selectedSiblings.includes(partyId)
    );

    const linkContacts = Object.entries(data.newContacts).map(
      ([contactPartyId, relationshipType]) => ({
        contactPartyId: Number(contactPartyId),
        relationshipType,
      })
    );

    updateSiblingsAndContacts(
      {
        studentPartyId: currentStudent.partyId,
        linkSiblings,
        unlinkSiblings,
        linkContacts,
        unlinkContacts: [],
      },
      {
        onSuccess: () => {
          closeAndResetModal();
        },
      }
    );
  });

  useEffect(() => {
    if (open) {
      reset({
        enrolledSiblings: currentSiblings?.enrolledSiblings ?? [],
        nonEnrolledSiblings: currentSiblings?.nonEnrolledSiblings ?? [],
        newContacts: {},
      });
    }
  }, [open]);

  const isStep1 = step === 1;
  const nextIsStep2 = isStep1 && additionalContacts.length > 0;

  return (
    <Dialog open={open} onClose={closeAndResetModal} fullWidth maxWidth="sm">
      <DialogTitle onClose={onClose}>
        {isStep1 ? t('people:manageSiblings') : t('people:associateContacts')}
      </DialogTitle>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <AnimatePresence initial={false} custom={step}>
          <Box
            component={m.div}
            key={step}
            custom={step}
            initial="enter"
            animate="center"
            exit="exit"
            variants={animationVariants}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            sx={{
              width: '100%',
            }}
          >
            {isStep1 ? (
              <SiblingSelect
                enrolledSiblings={enrolledSiblings}
                nonEnrolledSiblings={nonEnrolledSiblings}
                control={control}
                setValue={setValue}
              />
            ) : (
              <NewContactSelect
                currentStudent={currentStudent}
                additionalContacts={additionalContacts}
                newContacts={newContacts}
                setValue={setValue}
              />
            )}
          </Box>
        </AnimatePresence>
      </DialogContent>

      <DialogActions>
        <Button
          variant="soft"
          startIcon={isStep1 ? undefined : <ArrowLeftIcon />}
          onClick={() => {
            if (isStep1) {
              closeAndResetModal();
            } else {
              setStep(step - 1);
              setTimeout(() => {
                setValue('newContacts', {});
              }, 300);
            }
          }}
        >
          {isStep1 ? t('common:actions.cancel') : t('common:actions.back')}
        </Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          endIcon={nextIsStep2 ? <ArrowRightIcon /> : undefined}
          onClick={() => {
            if (nextIsStep2) {
              setStep(step + 1);
            } else {
              onSubmit();
            }
          }}
        >
          {nextIsStep2 ? t('common:actions.next') : t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
