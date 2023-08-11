import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  PageHeading,
  TabPageContainer,
  PageContainer,
  PreferredNameFormat,
} from '@tyro/core';
import {
  StaffAutocomplete,
  StaffSelectOption,
  useStaffForSelect,
} from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import React, { useState } from 'react';
import { useTheme } from '@mui/material';

export default function StudentProfileContainer() {
  const { t } = useTranslation(['printing']);
  const { spacing } = useTheme();
  const [selectedStaff, setSelectedStaff] = useState<StaffSelectOption | null>(
    null
  );
  return (
    <StaffAutocomplete
      inputProps={{
        variant: 'white-filled',
      }}
      sx={{ maxWidth: spacing(36) }}
      value={selectedStaff}
      onChange={(_e, value) =>
        setSelectedStaff(Array.isArray(value) ? value[0] : value)
      }
    />
  );
}
