import {
  RHFStaffAutocomplete,
  StaffSelectOption,
  useStaffForSelect,
} from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import React, { useEffect, useState } from 'react';
import { Button, Stack, useTheme, Box, Card, Grid } from '@mui/material';
import { RHFSelect, RHFSwitch, useFormValidator } from '@tyro/core';
import {
  Print_TimetableLayout,
  Print_TimetableOptions,
  Print_TimetableStaffFormat,
  Print_TimetablePeriodDisplayOnAxis,
  Print_TimetablePeriodDisplayInCell,
  Print_TimetableSubjectFormat,
} from '@tyro/api';
import { useForm, useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  getPrintTimetable,
  ReturnTypeFromUsePrintTimetable,
  usePrintTimetable,
} from '../../api/print-timetable';

export interface PrintStaffTimetableFormState {
  partyIds: any;
  roomIds: any;
  showRooms: boolean;
  teacherDisplayOption: Print_TimetableStaffFormat;
  layout: Print_TimetableLayout;
  showGroupNames: boolean;
  periodDisplayOnAxis: Print_TimetablePeriodDisplayOnAxis;
  periodDisplayInCell: Print_TimetablePeriodDisplayInCell;
  subjectFormat: Print_TimetableSubjectFormat;
  individualStudents: boolean;
  fontSize: FontSize;
}

enum FontSize {
  EXCEEDINGLY_SMALL = 'EXCEEDINGLY_SMALL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export interface TimetablePrintFormProps {
  // @ts-ignore
  translatePartyIds?: (any) => number[];
  // @ts-ignore
  translateRoomIds?: (any) => number[];
}

function mapFontSize(fontSize: FontSize) {
  switch (fontSize) {
    case FontSize.EXCEEDINGLY_SMALL:
      return 6;
    case FontSize.SMALL:
      return 10;
    case FontSize.MEDIUM:
      return 12;
    case FontSize.LARGE:
      return 18;
  }
}
export function TimetablePrintForm({
  translatePartyIds,
  translateRoomIds,
}: TimetablePrintFormProps) {
  const { t } = useTranslation(['printing', 'common']);
  const { spacing } = useTheme();
  const [selectedStaff, setSelectedStaff] = useState<StaffSelectOption[]>([]);
  const { data: teacherData } = useStaffForSelect({});
  const { resolver, rules } = useFormValidator<PrintStaffTimetableFormState>();

  const [filter, setFilter] = useState<Print_TimetableOptions>({
    partyIds: [1],
    showRooms: true,
    teacherDisplayOption: Print_TimetableStaffFormat.Full,
    layout: Print_TimetableLayout.DaysOnXAxis,
    showGroupNames: true,
    periodDisplayOnAxis: Print_TimetablePeriodDisplayOnAxis.Time,
    periodDisplayInCell: Print_TimetablePeriodDisplayInCell.Hide,
    subjectFormat: Print_TimetableSubjectFormat.Full,
    individualStudents: false,
    fontSize: 15,
  });
  const { control, handleSubmit, reset, watch } =
    useFormContext<PrintStaffTimetableFormState>();
  const { data: timetableData, isLoading } = usePrintTimetable(filter);
  const partyIds = watch('partyIds') as number[];
  const roomIds = watch('roomIds') as number[];
  const onSubmit = handleSubmit(
    ({
      showRooms,
      layout,
      teacherDisplayOption,
      showGroupNames,
      periodDisplayOnAxis,
      periodDisplayInCell,
      subjectFormat,
      individualStudents,
      fontSize,
    }) => {
      setFilter({
        partyIds: translatePartyIds ? translatePartyIds(partyIds) : [],
        roomIds: translateRoomIds ? translateRoomIds(roomIds) : [],
        showRooms,
        teacherDisplayOption,
        layout,
        showGroupNames,
        periodDisplayOnAxis,
        periodDisplayInCell,
        subjectFormat,
        individualStudents,
        fontSize: mapFontSize(fontSize),
      });
    }
  );

  const handlePrint = handleSubmit(
    async ({
      showRooms,
      layout,
      teacherDisplayOption,
      showGroupNames,
      periodDisplayOnAxis,
      periodDisplayInCell,
      subjectFormat,
      individualStudents,
      fontSize,
    }) => {
      const f = {
        partyIds: translatePartyIds ? translatePartyIds(partyIds) : [],
        showRooms,
        teacherDisplayOption,
        layout,
        showGroupNames,
        periodDisplayOnAxis,
        periodDisplayInCell,
        subjectFormat,
        individualStudents,
        fontSize: mapFontSize(fontSize),
      };
      const printResponse = await getPrintTimetable(f);

      if (
        printResponse &&
        printResponse.print_printTimetable &&
        printResponse.print_printTimetable.url
      )
        window.open(
          printResponse.print_printTimetable.url,
          '_blank',
          'noreferrer'
        );
    }
  );
  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2} direction="row" sx={{ py: 4 }}>
          <Grid item>
            <RHFSwitch
              label={t(`printing:timetable.options.showRooms`)}
              controlLabelProps={{
                sx: { ml: 0, height: '100%' },
              }}
              controlProps={{ name: 'showRooms', control }}
            />
          </Grid>
          <Grid item>
            <RHFSwitch
              label={t(`printing:timetable.options.showGroupNames`)}
              controlLabelProps={{
                sx: { ml: 0, height: '100%' },
              }}
              controlProps={{ name: 'showGroupNames', control }}
            />
          </Grid>
          <Grid item>
            <RHFSelect<PrintStaffTimetableFormState, Print_TimetableStaffFormat>
              fullWidth
              sx={{ minWidth: 200 }}
              label={t(`printing:timetable.options.teacherDisplayFormat`)}
              options={Object.values(Print_TimetableStaffFormat)}
              getOptionLabel={(option) =>
                t(`printing:timetable.teacherDisplayOptions.${option}`)
              }
              controlProps={{
                name: 'teacherDisplayOption',
                control,
              }}
            />
          </Grid>
          <Grid item>
            <RHFSelect<PrintStaffTimetableFormState, Print_TimetableLayout>
              fullWidth
              sx={{ minWidth: 200 }}
              label={t(`printing:timetable.options.layout`)}
              options={Object.values(Print_TimetableLayout)}
              getOptionLabel={(option) =>
                t(`printing:timetable.layout.${option}`)
              }
              controlProps={{
                name: 'layout',
                control,
              }}
            />
          </Grid>
          <Grid item>
            <RHFSelect<
              PrintStaffTimetableFormState,
              Print_TimetablePeriodDisplayOnAxis
            >
              fullWidth
              sx={{ minWidth: 200 }}
              label={t(`printing:timetable.options.periodDisplayOnAxis`)}
              options={Object.values(Print_TimetablePeriodDisplayOnAxis)}
              getOptionLabel={(option) =>
                t(`printing:timetable.periodDisplayOnAxis.${option}`)
              }
              controlProps={{
                name: 'periodDisplayOnAxis',
                control,
              }}
            />
          </Grid>
          <Grid item>
            <RHFSelect<
              PrintStaffTimetableFormState,
              Print_TimetablePeriodDisplayInCell
            >
              fullWidth
              sx={{ minWidth: 200 }}
              label={t(`printing:timetable.options.periodDisplayInCell`)}
              options={Object.values(Print_TimetablePeriodDisplayInCell)}
              getOptionLabel={(option) =>
                t(`printing:timetable.periodDisplayInCell.${option}`)
              }
              controlProps={{
                name: 'periodDisplayInCell',
                control,
              }}
            />
          </Grid>
          <Grid item>
            <RHFSelect<PrintStaffTimetableFormState, FontSize>
              fullWidth
              sx={{ minWidth: 200 }}
              label={t(`printing:timetable.options.fontSize`)}
              options={Object.values(FontSize)}
              getOptionLabel={(option) =>
                t(`printing:timetable.fontSize.${option}`)
              }
              controlProps={{
                name: 'fontSize',
                control,
              }}
            />
          </Grid>
          <Grid item>
            <RHFSelect<
              PrintStaffTimetableFormState,
              Print_TimetableSubjectFormat
            >
              fullWidth
              sx={{ minWidth: 200 }}
              label={t(`printing:timetable.options.subjectFormat`)}
              options={Object.values(Print_TimetableSubjectFormat)}
              getOptionLabel={(option) =>
                t(`printing:timetable.subjectFormat.${option}`)
              }
              controlProps={{
                name: 'subjectFormat',
                control,
              }}
            />
          </Grid>
        </Grid>
        <Stack justifyContent="right" direction="row" gap={1.5}>
          <LoadingButton
            size="large"
            variant="contained"
            type="submit"
            loading={isLoading}
          >
            {t('common:actions.view')}
          </LoadingButton>
          <LoadingButton
            size="large"
            variant="contained"
            loading={isLoading}
            onClick={handlePrint}
          >
            {t('common:actions.print')}
          </LoadingButton>
        </Stack>
      </form>
      <Stack style={{ maxHeight: '100%', overflow: 'auto' }}>
        {timetableData && timetableData.html && (
          <div
            style={{ maxHeight: '100%', overflow: 'auto' }}
            dangerouslySetInnerHTML={{ __html: timetableData.html }}
          />
        )}
      </Stack>
    </>
  );
}

export const defaultValues = {
  showRooms: true,
  teacherDisplayOption: Print_TimetableStaffFormat.Full,
  layout: Print_TimetableLayout.DaysOnXAxis,
  showGroupNames: true,
  periodDisplayOnAxis: Print_TimetablePeriodDisplayOnAxis.Time,
  periodDisplayInCell: Print_TimetablePeriodDisplayInCell.Hide,
  subjectFormat: Print_TimetableSubjectFormat.Full,
  fontSize: FontSize.LARGE,
} as PrintStaffTimetableFormState;