import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { UpsertStudentMedicalConditionInput } from '@tyro/api';
import { AnimatePresence, m, Variants, wrap } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
  LocationIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useStudentMedicalData } from '../../../api/student/medicals/student-medical-data';

export type EditConditionsFormState = Pick<
  UpsertStudentMedicalConditionInput,
  'id' | 'name' | 'description' | 'equipment'
> & {
  active?: boolean;
};

type StudentMedicalProfessionalWidgetProps = {
  studentId: number | undefined;
};

const animationVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    position: 'absolute',
  }),
  center: {
    x: '0%',
    position: 'relative',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    position: 'absolute',
  }),
};

export function StudentMedicalProfessionalWidget({
  studentId,
}: StudentMedicalProfessionalWidgetProps) {
  const [[contactIndex, direction], setContactIndex] = useState([0, 0]);
  const { t } = useTranslation(['people']);
  const { displayName } = usePreferredNameLayout();

  const { data: medicalData, isLoading } = useStudentMedicalData(
    studentId ?? 0
  );

  const numberOfContacts = medicalData?.medicalContacts?.length ?? 0;
  const clampedIndex = wrap(0, numberOfContacts, contactIndex);

  const medicalContact = medicalData?.medicalContacts?.[clampedIndex] ?? {};
  const isButtonsDisabled = isLoading || numberOfContacts <= 1;
  const buttonTooltipTitle = isButtonsDisabled
    ? t('people:nextContactDisabled', { count: numberOfContacts })
    : '';

  const paginate = (newDirection: number) => {
    setContactIndex([contactIndex + newDirection, newDirection]);
  };

  const medicalAddress = useMemo(() => {
    const addressKeys: Array<keyof typeof medicalContact> = [
      'addressLine2',
      'addressLine3',
      'county',
      'postcode',
    ];

    return addressKeys.reduce((address, currentKey) => {
      const currentValue = medicalContact?.[currentKey];
      if (!currentValue) return address;
      return address ? `${address}, ${currentValue}` : `${currentValue}`;
    }, medicalContact?.addressLine1);
  }, [medicalContact]);

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader component="h3" title="Medical professional" />
      {numberOfContacts === 0 ? (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
          }}
        >
          <Chip label={t('people:noMedicalContacts')} />
        </Stack>
      ) : (
        <>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Tooltip title={buttonTooltipTitle}>
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  disabled={isButtonsDisabled}
                  onClick={() => paginate(-1)}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Box sx={{ flex: 1, overflowX: 'hidden' }}>
              <Typography
                component="h4"
                variant="subtitle2"
                noWrap
                px={2}
                textOverflow="ellipsis"
                textAlign="center"
              >
                <Box component="span" fontWeight={600}>
                  {clampedIndex + 1}/{medicalData?.medicalContacts?.length}
                </Box>
              </Typography>
            </Box>

            <Tooltip title={buttonTooltipTitle}>
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  disabled={isButtonsDisabled}
                  onClick={() => paginate(1)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <AnimatePresence initial={false} custom={direction}>
            <Box
              component={m.div}
              key={contactIndex}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={animationVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
              sx={{
                width: '100%',
              }}
            >
              <Box sx={{ px: 3, py: 1 }}>
                <Stack direction="row" spacing={2} sx={{ py: 1 }}>
                  <Avatar
                    name={displayName(medicalContact)}
                    sx={{ width: 62, height: 62, fontSize: 20 }}
                  />
                  <Stack>
                    <Typography variant="h6">
                      {medicalContact?.personalTitle}{' '}
                      {displayName(medicalContact)}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'slate.600' }}>
                      {medicalContact?.occupation}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ py: 1 }}>
                  <LocationIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Stack>
                    <Typography variant="body1">{medicalAddress}</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ py: 1 }}>
                  <PhoneIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Stack>
                    <Typography variant="body1">
                      {medicalContact?.primaryPhone}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ py: 1 }}>
                  <MailIcon
                    sx={{ color: 'slate.400', width: 20, height: 20 }}
                  />
                  <Stack>
                    <Typography variant="body1">
                      {medicalContact?.email}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </AnimatePresence>
        </>
      )}
    </Card>
  );
}
