import {
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { AttendanceCodeType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { InfoCircleIcon, SchoolBuildingIcon } from '@tyro/icons';
import { useEffect, useRef, useState } from 'react';
import { useAttendanceCodes } from '../api';

type AttendanceToggleProps = {
  codeId?: number;
  onChange: (newCodeId: number) => void;
};

export function AttendanceToggle({
  codeId: initialCodeId,
  onChange,
}: AttendanceToggleProps) {
  const { t } = useTranslation(['attendance']);

  const absentToggleRef = useRef<HTMLButtonElement>(null);

  const [isAbsentMenuOpen, setIsAbsentMenuOpen] = useState(false);
  const [codeType, setCodeType] = useState<AttendanceCodeType>();

  const { data: codesData, isLoading } = useAttendanceCodes({ custom: false });

  const handleAttendanceCodeChange = (code: AttendanceCodeType | number) => {
    const currentCode = codesData?.find((attendanceCode) => {
      if (typeof code === 'number') return attendanceCode?.id === code;
      return attendanceCode?.codeType === code;
    });

    if (currentCode) {
      setCodeType(currentCode.codeType);
      onChange(currentCode.id);
      setIsAbsentMenuOpen(false);
    }
  };

  useEffect(() => {
    if (codesData?.length) {
      handleAttendanceCodeChange(initialCodeId ?? AttendanceCodeType.Present);
    }
  }, [codesData, initialCodeId]);

  const isAbsentCodeSelected =
    codeType === AttendanceCodeType.ExplainedAbsence ||
    codeType === AttendanceCodeType.UnexplainedAbsence;

  if (isLoading) return null;

  return (
    <>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={codeType}
        onChange={(_ev, code: AttendanceCodeType) => {
          if (typeof code === 'string') {
            handleAttendanceCodeChange(code);
          }
        }}
      >
        <ToggleButton
          value={AttendanceCodeType.Present}
          color="success"
          onClick={() => handleAttendanceCodeChange(AttendanceCodeType.Present)}
        >
          {t('attendance:nameByCodeType.PRESENT')}
        </ToggleButton>
        <ToggleButton
          value={AttendanceCodeType.Late}
          color="info"
          onClick={() => handleAttendanceCodeChange(AttendanceCodeType.Late)}
        >
          {t('attendance:nameByCodeType.LATE')}
        </ToggleButton>
        <ToggleButton
          ref={absentToggleRef}
          color="error"
          value={{}}
          selected={isAbsentMenuOpen || isAbsentCodeSelected}
          onClick={() => setIsAbsentMenuOpen(true)}
        >
          {t('attendance:absent')}
        </ToggleButton>
      </ToggleButtonGroup>
      <Menu
        anchorEl={absentToggleRef.current}
        open={isAbsentMenuOpen}
        PaperProps={{
          sx: {
            width: 'auto',
            overflow: 'visible',
            filter: 'drop-shadow(0px 0px 2px rgba(145, 158, 171, 0.24))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 'calc(50% + -5px)',
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
            '& .MuiListItemIcon-root': {
              justifyContent: 'flex-end',
              margin: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        onClose={() => setIsAbsentMenuOpen(false)}
      >
        <MenuItem
          dense
          selected={codeType === AttendanceCodeType.ExplainedAbsence}
          onClick={() =>
            handleAttendanceCodeChange(AttendanceCodeType.ExplainedAbsence)
          }
        >
          <ListItemText>
            {t('attendance:nameByCodeType.EXPLAINED_ABSENCE')}
          </ListItemText>
          <ListItemIcon>
            <SchoolBuildingIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          dense
          selected={codeType === AttendanceCodeType.UnexplainedAbsence}
          onClick={() =>
            handleAttendanceCodeChange(AttendanceCodeType.UnexplainedAbsence)
          }
        >
          <ListItemText>
            {t('attendance:nameByCodeType.UNEXPLAINED_ABSENCE')}
          </ListItemText>
          <ListItemIcon>
            <InfoCircleIcon />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </>
  );
}
