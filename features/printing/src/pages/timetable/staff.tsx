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
import {
  RHFCheckbox,
  RHFSelect,
  RHFSwitch,
  useFormValidator,
} from '@tyro/core';
import {
  Print_TimetableOptions,
  Swm_UpsertStaffAbsenceLongTermLeaveGroupInput,
} from '@tyro/api';
import { Dayjs } from 'dayjs';
import { useForm } from 'react-hook-form';
import { usePrintTimetable } from '../../api/print-timetable';
import { useDownloadHtml } from '../../api/download-html';

enum TeacherDisplayOptions {
  FULL_NAME = 'fullName',
}

interface PrintStaffTimetableFormState {
  staff: NonNullable<StaffSelectOption[]>;
  showRooms: boolean;
  teacherDisplayOption: TeacherDisplayOptions;
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

  const onSubmit = handleSubmit(({ staff, showRooms }) => {
    console.log(staff);
    setFilter({
      partyIds: staff.map((s) => s.partyId) ?? [],
      daysXPeriodsY: true,
      individual: true,
    });
  });
  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack direction="row">
          <RHFStaffAutocomplete
            multiple
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
          <RHFSelect<PrintStaffTimetableFormState, TeacherDisplayOptions>
            label="Teacher "
            options={Object.values(TeacherDisplayOptions)}
            getOptionLabel={(option) =>
              t(`printing:timetable.teacherDisplayOptions.${option}`)
            }
            controlProps={{
              name: 'teacherDisplayOption',
              control,
            }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button size="large" variant="contained" type="submit">
            {t('common:actions.view')}
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              if (printTimetableUrl) {
                downloadHtml(printTimetableUrl).then((r) => {
                  window.open(
                    'data:text/html,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E',
                    '_blank',
                    'noreferrer'
                  );
                });
              }
            }}
          >
            {t('common:actions.print')}
          </Button>
          <a
            href="data:text/html,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E"
            target="_blank"
            rel="noreferrer"
          >
            asdasd
          </a>
        </Stack>
      </form>
      <div dangerouslySetInnerHTML={{ __html: timetableHtml }} />
    </>
  );
}
