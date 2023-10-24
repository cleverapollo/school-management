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
import { useRef, useState } from 'react';
import { useAttendanceCodeById } from '../hooks/use-attendance-by-id';
import { useAttendanceCodeByType } from '../hooks/use-attendance-by-type';

type AttendanceToggleProps = {
  codeId?: number | null;
  onChange: (newCodeId: number) => void;
};

export function AttendanceToggle({ codeId, onChange }: AttendanceToggleProps) {
  const { t } = useTranslation(['attendance']);

  const absentToggleRef = useRef<HTMLButtonElement>(null);

  const [isAbsentMenuOpen, setIsAbsentMenuOpen] = useState(false);

  const codeByType = useAttendanceCodeByType({ teachingGroupCodes: true });
  const codeById = useAttendanceCodeById({ teachingGroupCodes: true });

  const handleAttendanceCodeChange = (code: AttendanceCodeType | number) => {
    if (codeById && codeByType) {
      const currentCode =
        typeof code === 'number' ? codeById[code] : codeByType[code];

      if (currentCode) {
        onChange(currentCode.id);
        setIsAbsentMenuOpen(false);
      }
    }
  };

  const codeType = codeId
    ? codeById?.[codeId]?.codeType
    : codeByType?.PRESENT?.codeType;

  const isAbsentCodeSelected =
    codeType === AttendanceCodeType.ExplainedAbsence ||
    codeType === AttendanceCodeType.UnexplainedAbsence;

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
      </Menu>
    </>
  );
}
