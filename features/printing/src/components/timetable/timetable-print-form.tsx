import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { Stack, Card, Typography } from '@mui/material';
import { RHFCheckboxGroup, RHFRadioGroup, RHFSelect } from '@tyro/core';
import {
  Print_TimetableLayout,
  Print_TimetableOptions,
  Print_TimetableStaffFormat,
  Print_TimetablePeriodDisplayOnAxis,
  Print_TimetablePeriodDisplayInCell,
  Print_TimetableSubjectFormat,
} from '@tyro/api';
import { useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { getStaffForSelect } from '@tyro/people';
import { getCoreRooms } from '@tyro/settings';
import {
  getPrintTimetable,
  usePrintTimetable,
} from '../../api/print-timetable';

const checkboxOptions = ['showRooms', 'showGroupNames'] as const;

enum FontSize {
  EXCEEDINGLY_SMALL = 'EXCEEDINGLY_SMALL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export interface PrintStaffTimetableFormState<T> {
  parties: T[];
  rooms: T[];
  allStaff?: boolean;
  allRooms?: boolean;
  teacherDisplayOption: Print_TimetableStaffFormat;
  layout: Print_TimetableLayout;
  periodDisplayOnAxis: Print_TimetablePeriodDisplayOnAxis;
  periodDisplayInCell: Print_TimetablePeriodDisplayInCell;
  subjectFormat: Print_TimetableSubjectFormat;
  individualStudents?: boolean;
  fontSize: FontSize;
  colorSetting: 'COLOR' | 'BLACK_AND_WHITE';
  checkBoxes: (typeof checkboxOptions)[number][];
}

export interface TimetablePrintFormProps<T> {
  translateIds: (partiesOrRooms: T[]) => number[];
  isRoom?: boolean;
}

function mapFontSize(fontSize: FontSize) {
  switch (fontSize) {
    case FontSize.EXCEEDINGLY_SMALL:
      return 6;
    case FontSize.SMALL:
      return 10;
    case FontSize.LARGE:
      return 18;
    default: // MEDIUM
      return 12;
  }
}

export function getDefaultValues<T>() {
  return {
    parties: [],
    rooms: [],
    showRooms: true,
    teacherDisplayOption: Print_TimetableStaffFormat.Full,
    layout: Print_TimetableLayout.DaysOnXAxis,
    showGroupNames: true,
    periodDisplayOnAxis: Print_TimetablePeriodDisplayOnAxis.Time,
    periodDisplayInCell: Print_TimetablePeriodDisplayInCell.Hide,
    subjectFormat: Print_TimetableSubjectFormat.Full,
    fontSize: FontSize.MEDIUM,
    checkBoxes: ['showRooms', 'showGroupNames'],
    colorSetting: 'COLOR',
  } as PrintStaffTimetableFormState<T>;
}

export function TimetablePrintForm<T>({
  translateIds,
  isRoom = false,
}: TimetablePrintFormProps<T>) {
  const { t } = useTranslation(['printing', 'common']);

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
    printWithColour: true,
  });

  const { control, handleSubmit } =
    useFormContext<PrintStaffTimetableFormState<T>>();
  const { data: timetableData, isLoading } = usePrintTimetable(filter);

  const getTimetableOptions = async ({
    parties,
    rooms,
    allStaff,
    allRooms,
    layout,
    teacherDisplayOption,
    periodDisplayOnAxis,
    periodDisplayInCell,
    subjectFormat,
    individualStudents,
    fontSize,
    colorSetting,
    checkBoxes,
  }: PrintStaffTimetableFormState<T>): Promise<Print_TimetableOptions> => {
    let mappedPartyIds = !isRoom ? translateIds(parties) : [];
    let mappedRoomIds = isRoom ? translateIds(rooms) : [];

    if (allStaff) {
      const { core_staff: coreStaff } = await getStaffForSelect({});
      mappedPartyIds = coreStaff.map(({ partyId }) => partyId);
    }

    if (allRooms) {
      const { core_rooms: coreRooms } = await getCoreRooms();
      mappedRoomIds = (coreRooms ?? []).map(({ roomId }) => roomId);
    }
    return {
      partyIds: mappedPartyIds,
      roomIds: mappedRoomIds,
      teacherDisplayOption,
      layout,
      ...checkboxOptions.reduce((acc, option) => {
        acc[option] = checkBoxes.includes(option);
        return acc;
      }, {} as Pick<Print_TimetableOptions, 'showRooms' | 'showGroupNames'>),
      periodDisplayOnAxis,
      periodDisplayInCell,
      subjectFormat,
      individualStudents: individualStudents ?? false,
      fontSize: mapFontSize(fontSize),
      printWithColour: colorSetting === 'COLOR',
    };
  };

  const onView = handleSubmit(async (formState) => {
    const timetableOptions = await getTimetableOptions(formState);
    setFilter(timetableOptions);
  });

  const handlePrint = handleSubmit(async (formState) => {
    const timetableOptions = await getTimetableOptions(formState);
    const printResponse = await getPrintTimetable(timetableOptions);

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
  });

  return (
    <Stack spacing={2} pt={2}>
      <form onSubmit={onView}>
        <Stack direction="row" spacing={2}>
          <Card sx={{ py: 1.5, px: 2.5, flex: 1 }}>
            <Typography variant="h6" sx={{ pb: 2 }}>
              {t('printing:selectInfoToPrint')}
            </Typography>
            <Stack direction="row" spacing={4}>
              <Stack spacing={2} flex={1} maxWidth={300}>
                <RHFSelect<
                  PrintStaffTimetableFormState<T>,
                  Print_TimetableStaffFormat
                >
                  fullWidth
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
                <RHFSelect<
                  PrintStaffTimetableFormState<T>,
                  Print_TimetableLayout
                >
                  fullWidth
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
                <RHFSelect<
                  PrintStaffTimetableFormState<T>,
                  Print_TimetablePeriodDisplayOnAxis
                >
                  fullWidth
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
              </Stack>
              <Stack spacing={2} flex={1} maxWidth={300}>
                <RHFSelect<
                  PrintStaffTimetableFormState<T>,
                  Print_TimetablePeriodDisplayInCell
                >
                  fullWidth
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
                <RHFSelect<
                  PrintStaffTimetableFormState<T>,
                  Print_TimetableSubjectFormat
                >
                  fullWidth
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
              </Stack>
              <RHFCheckboxGroup
                label={t('printing:otherInfoToShow')}
                controlProps={{ name: 'checkBoxes', control }}
                options={[...checkboxOptions]}
                getOptionLabel={(option) =>
                  t(`printing:timetable.checkboxes.${option}`)
                }
              />
            </Stack>
          </Card>
          <Stack spacing={2}>
            <Card
              sx={{ py: 1.5, px: 2.5, backgroundColor: 'slate.100', flex: 1 }}
              variant="outlined"
            >
              <Typography variant="h6" sx={{ pb: 2 }}>
                {t('printing:printSettings.title')}
              </Typography>
              <Stack spacing={1}>
                <RHFRadioGroup
                  label={t('printing:printSettings.colourSettings.title')}
                  disabled={isLoading}
                  options={(['COLOR', 'BLACK_AND_WHITE'] as const).map(
                    (option) => ({
                      value: option,
                      label: t(
                        `printing:printSettings.colourSettings.${option}`
                      ),
                    })
                  )}
                  controlProps={{
                    name: 'colorSetting',
                    control,
                  }}
                />
                <RHFRadioGroup
                  label={t('printing:printSettings.fontSize.title')}
                  disabled={isLoading}
                  options={Object.values(FontSize).map((option) => ({
                    value: option,
                    label: t(`printing:printSettings.fontSize.${option}`),
                  }))}
                  controlProps={{
                    name: 'fontSize',
                    control,
                  }}
                />
              </Stack>
            </Card>
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="soft"
                type="submit"
                loading={isLoading}
                sx={{ flex: 1 }}
              >
                {t('common:actions.view')}
              </LoadingButton>
              <LoadingButton
                variant="contained"
                loading={isLoading}
                onClick={handlePrint}
                sx={{ flex: 1 }}
              >
                {t('common:actions.print')}
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </form>
      <Card>
        <Stack
          style={{
            maxHeight: '100%',
            overflow: 'auto',
            padding: '16px',
            paddingTop: '8px',
          }}
        >
          {timetableData?.html && (
            <div
              style={{ maxHeight: '100%', overflow: 'auto' }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: timetableData.html }}
            />
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
