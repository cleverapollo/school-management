import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
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
  studentId,
  currentSiblings,
}: ManageSiblingModalProps) {
  const { t } = useTranslation(['common', 'timetable', 'people']);
  const [step, setStep] = useState(1);
  const { data: studentsCurrentContact } = useStudentsContacts(studentId, open);
  const { mutateAsync: updateSiblingsAndContacts, isLoading } =
    useUpdateSiblingsAndContacts();

  const { reset, handleSubmit, setValue, watch } =
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
      reset();
      setStep(1);
    }, 300);
  };

  const [enrolledSiblings, nonEnrolledSiblings] = watch([
    'enrolledSiblings',
    'nonEnrolledSiblings',
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
        studentPartyId: studentId,
        linkSiblings,
        unlinkSiblings,
        linkContacts,
      },
      {
        onSuccess: () => {
          closeAndResetModal();
        },
      }
    );
  });

  const hasAStep2 = step === 1 && additionalContacts.length > 0;

  return (
    <Dialog open={open} onClose={closeAndResetModal} fullWidth maxWidth="sm">
      <DialogTitle>
        {step === 1
          ? t('people:manageSiblings')
          : t('people:linkAdditionalContacts')}
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
            {step === 1 ? (
              <SiblingSelect
                enrolledSiblings={enrolledSiblings}
                nonEnrolledSiblings={nonEnrolledSiblings}
                setValue={setValue}
              />
            ) : (
              <NewContactSelect
                additionalContacts={additionalContacts}
                watch={watch}
                setValue={setValue}
              />
            )}
          </Box>
        </AnimatePresence>
      </DialogContent>

      <DialogActions>
        <Button
          variant="soft"
          startIcon={step === 2 ? <ArrowLeftIcon /> : undefined}
          onClick={() => {
            if (step === 1) {
              closeAndResetModal();
            } else {
              setStep(step - 1);
              setTimeout(() => {
                setValue('newContacts', {});
              }, 300);
            }
          }}
        >
          {step === 1 ? t('common:actions.cancel') : t('common:actions.back')}
        </Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          endIcon={hasAStep2 ? <ArrowRightIcon /> : undefined}
          onClick={() => {
            if (hasAStep2) {
              setStep(step + 1);
            } else {
              onSubmit();
            }
          }}
        >
          {hasAStep2 ? t('common:actions.next') : t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
