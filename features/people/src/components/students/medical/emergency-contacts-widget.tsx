import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { AnimatePresence, m, Variants, wrap } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
} from '@tyro/icons';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';
import {
  Avatar,
  getNumber,
  usePreferredNameLayout,
  formatPhoneNumber,
} from '@tyro/core';
import { useStudentMedical } from '../../../api/student/medical';

export function EmergencyContactsWidget() {
  const { t } = useTranslation(['common', 'people']);

  const { id } = useParams();
  const studentId = getNumber(id);

  const { data: medicalData } = useStudentMedical(studentId ?? 0);
  console.log(medicalData, 'medicalData - EmergencyContactsWidget');

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader
        component="h3"
        title="Emergency Contacts"
        sx={{ backgroundColor: 'slate.100', px: 2.25 }}
      />
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.25,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'slate.400',
          fontWeight: 600,
        }}
      >
        <Typography component="h4" variant="subtitle2" noWrap>
          {t('common:name')}
        </Typography>
        <Typography component="h4" variant="subtitle2" noWrap>
          {t('common:phoneNumber')}
        </Typography>
      </Stack>
      {medicalData && medicalData.student?.contacts ? (
        <Stack
          direction="row"
          sx={{
            px: 2.25,
            py: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Stack direction="row">
              <Avatar />
              <Box sx={{ px: 2.25 }}>
                <Typography variant="body2" sx={{ color: 'slate.800' }}>
                  Calista Campbell
                </Typography>
                <Typography variant="body2" sx={{ color: 'slate.500' }}>
                  Mother
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            {' '}
            <Typography variant="body2">+1 555-555-5555</Typography>
          </Box>
        </Stack>
      ) : (
        <Stack>
          <Typography variant="body2" sx={{ color: 'slate.800', px: 2.25 }}>
            No emergency contacts
          </Typography>
        </Stack>
      )}
    </Card>
  );
}
