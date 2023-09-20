import { Select } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SessionAttendanceFlag } from '@tyro/api';

interface ApplyToSubjectSelectProps {
  value: SessionAttendanceFlag | null;
  onChange: (value: ApplyToSubjectSelectProps['value']) => void;
}

export function ApplyToSubjectSelect({
  value,
  onChange,
}: ApplyToSubjectSelectProps) {
  const { t } = useTranslation(['attendance']);
  const options = [
    { id: 'null', name: t('attendance:applyToSubjectAttendanceOptions.no') },
    {
      id: SessionAttendanceFlag.AbsentCodesOnly,
      name: t('attendance:applyToSubjectAttendanceOptions.onlyForAbsentCodes'),
    },
    {
      id: SessionAttendanceFlag.AllCodes,
      name: t(
        'attendance:applyToSubjectAttendanceOptions.forAllAttendanceCodes'
      ),
    },
  ];

  return (
    <Select
      label={t('attendance:applyToSubjectAttendance')}
      value={value ?? 'null'}
      optionIdKey="id"
      options={options}
      getOptionLabel={(option) => option.name}
      fullWidth
      sx={{
        width: {
          xs: '100%',
          sm: 300,
        },
      }}
      size="small"
      onChange={(e) => {
        const { value: newValue } = e.target;
        onChange(
          newValue === 'null' ? null : (newValue as SessionAttendanceFlag)
        );
      }}
    />
  );
}
