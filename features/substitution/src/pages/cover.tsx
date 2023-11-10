import { useState, useEffect } from 'react';
import { Stack, useTheme } from '@mui/material';
import {
  PageContainer,
  PageHeading,
  Select,
  useBreakpointValue,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  StaffAutocomplete,
  StaffSelectOption,
  useStaffForSelect,
} from '@tyro/people';
import dayjs, { Dayjs } from 'dayjs';
import '../styles/cover-print.css';
import { DayCoverTable } from '../components/cover/day-cover-table';
import { StaffCoverTable } from '../components/cover/staff-cover-table';

export default function Cover() {
  const [date, setDate] = useState(dayjs());
  const { t } = useTranslation(['common', 'navigation', 'substitution']);
  const { spacing } = useTheme();
  const [viewType, setViewType] = useState<'day' | 'staff'>('day');
  const [selectedStaff, setSelectedStaff] = useState<StaffSelectOption | null>(
    null
  );

  const { data: teacherData } = useStaffForSelect({});
  const dropdownDirection = useBreakpointValue<'column' | 'row'>({
    base: 'column',
    sm: 'row',
  });

  const viewOptions = [
    {
      id: 'day',
      name: t('substitution:day'),
    },
    {
      id: 'staff',
      name: t('common:staff'),
    },
  ];

  const goToStaffMembersView = (staff: StaffSelectOption) => {
    setSelectedStaff(staff);
    setViewType('staff');
  };

  const goToDateOnDayView = (newDate: Dayjs) => {
    setViewType('day');
    setDate(newDate);
  };

  useEffect(() => {
    if (teacherData && !selectedStaff) {
      setSelectedStaff(teacherData[0]);
    }
  }, [teacherData]);

  return (
    <PageContainer
      title={t('navigation:management.substitution.cover')}
      maxWidth={false}
      sx={{ maxWidth: 2200 }}
    >
      <PageHeading
        title={t('navigation:management.substitution.cover')}
        titleProps={{ variant: 'h3' }}
      />
      <Stack direction={dropdownDirection} spacing={2}>
        <Select
          label={t('common:view')}
          value={viewType}
          variant="white-filled"
          optionIdKey="id"
          options={viewOptions}
          getOptionLabel={(option) => option.name}
          fullWidth
          sx={{ maxWidth: spacing(24) }}
          onChange={({ target }) =>
            setViewType(target.value as typeof viewType)
          }
        />
        {viewType === 'staff' && (
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
        )}
      </Stack>

      {viewType === 'day' ? (
        <DayCoverTable
          goToStaffMembersView={goToStaffMembersView}
          date={date}
          setDate={setDate}
        />
      ) : (
        <StaffCoverTable
          goToDateOnDayView={goToDateOnDayView}
          staffPartyId={selectedStaff?.partyId}
          date={date}
          setDate={setDate}
        />
      )}
    </PageContainer>
  );
}
