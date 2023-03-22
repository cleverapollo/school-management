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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAttendanceCodes } from '../api';

type AttendanceToggleProps = {
  codeId?: number;
  onChange: (newCodeId: number) => void;
};

type AttendanceCodeMapId = Record<AttendanceCodeType, number>;

export function AttendanceToggle({
  codeId: initialCodeId,
  onChange,
}: AttendanceToggleProps) {
  const { t } = useTranslation(['attendance']);

  const absentToggleRef = useRef<HTMLButtonElement>(null);
  const codeIdByTypeRef = useRef<AttendanceCodeMapId>();

  const [isAbsentMenuOpen, setAbsentMenuOpen] = useState(false);
  const [codeType, setAttendanceCodeType] = useState<AttendanceCodeType>();

  const { data: codesData, isLoading } = useAttendanceCodes({ custom: false });

  codeIdByTypeRef.current = useMemo(
    () =>
      (codesData || []).reduce((codesByType, code) => {
        if (codesByType && code) {
          codesByType[code.codeType] = code.id;
        }

        return codesByType;
      }, {} as AttendanceCodeMapId),
    [codesData]
  );

  useEffect(() => {
    if (codesData?.length && codeIdByTypeRef.current) {
      const currentCode = codesData.find((code) => code?.id === initialCodeId);
      const newCodeType = currentCode?.codeType ?? AttendanceCodeType.Present;

      setAttendanceCodeType(newCodeType);
      onChange(codeIdByTypeRef.current[newCodeType]);
    }
  }, [codesData?.length, initialCodeId]);

  const handleAttendanceCodeChange = (code: AttendanceCodeType) => {
    if (codeIdByTypeRef.current) {
      setAttendanceCodeType(code);
      onChange(codeIdByTypeRef.current[code]);
      setAbsentMenuOpen(false);
    }
  };

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
          onClick={() => setAbsentMenuOpen(true)}
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
        onClose={() => setAbsentMenuOpen(false)}
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
