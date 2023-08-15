import { useParams } from 'react-router-dom';
import {
  RHFStaffAutocomplete,
  StaffAutocomplete,
  StaffSelectOption,
  useStaffForSelect,
  useStudentsForSelect,
} from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import React, { useEffect, useState } from 'react';
import { Button, Stack, useTheme } from '@mui/material';
import { RHFCheckbox, RHFSwitch, useFormValidator } from '@tyro/core';
import {
  Print_TimetableOptions,
  Swm_UpsertStaffAbsenceLongTermLeaveGroupInput,
} from '@tyro/api';
import { Dayjs } from 'dayjs';
import { useForm } from 'react-hook-form';
import { usePrintTimetable } from '../../api/print-timetable';
import { useDownloadHtml } from '../../api/download-html';

interface PrintStaffTimetableFormState {
  staff: NonNullable<StaffSelectOption>;
  showRooms: boolean;
}

export default function StudentProfileContainer() {
  const { t } = useTranslation(['printing', 'common']);
  const { spacing } = useTheme();
  const [selectedStaff, setSelectedStaff] = useState<StaffSelectOption[]>([]);
  const { data: teacherData } = useStaffForSelect({});
  const { resolver, rules } = useFormValidator<PrintStaffTimetableFormState>();

  const [filter, setFilter] = useState<Print_TimetableOptions>({
    partyIds: [1],
    daysXPeriodsY: true,
    individual: true,
  });
  const { control, handleSubmit, reset, watch } =
    useForm<PrintStaffTimetableFormState>();
  const { data: printTimetableUrl } = usePrintTimetable(filter);
  const [downloadUuid, setDownloadUUid] = useState<string | null>(null);
  const { mutateAsync: downloadHtml, isLoading } = useDownloadHtml();
  const [timetableHtml, setTimetableHtml] = useState<string>('<b>asasd</b>');
  useEffect(() => {
    if (teacherData && !selectedStaff) {
      setSelectedStaff(teacherData);
    }
  }, [teacherData]);

  useEffect(() => {
    if (printTimetableUrl) {
      setDownloadUUid(printTimetableUrl);
      downloadHtml(printTimetableUrl).then((r) => setTimetableHtml(r));
    }
  }, [printTimetableUrl]);

  return (
    <>
      <form>
        <Stack
        <RHFStaffAutocomplete
          controlProps={{
            name: 'staff',
            control,
          }}
        />
        <RHFSwitch
          label="Show Rooms"
          controlLabelProps={{
            sx: { ml: 0, height: '100%' },
          }}
          controlProps={{ name: 'showRooms', control }}
        />
        <Stack direction="row" spacing={2}>
          <Button
            size="large"
            variant="contained"
            onClick={async () => {
              setFilter({
                partyIds: selectedStaff.map((staff) => staff.partyId),
                daysXPeriodsY: true,
                individual: true,
              });
              if (printTimetableUrl) {
                const response = await downloadHtml(printTimetableUrl);
                setTimetableHtml(response);
              }

              // const result = q({
              //   partyIds: selectedStaff.map((staff) => staff.partyId),
              //   daysXPeriodsY: true,
              //   individual: true,
              // });
              console.log('a');
            }}
          >
            {t('common:actions.view')}
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              if (printTimetableUrl) {
                downloadHtml(printTimetableUrl).then((r) => {
                  window.open(
                    `${window.location.origin}/api/download/${printTimetableUrl}`,
                    '_blank',
                    'noreferrer'
                  );
                });
              }
            }}
          >
            {t('common:actions.print')}
          </Button>
        </Stack>
      </form>
      <div dangerouslySetInnerHTML={{ __html: timetableHtml }} />
    </>
  );
}
