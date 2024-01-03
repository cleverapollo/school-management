import { useMemo, useState } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  ChevronDownIcon,
  CalendarAddIcon,
  CalendarCheckmarkIcon,
  CalendarCutDottedLinesIcon,
} from '@tyro/icons';
import { useDisclosure } from '@tyro/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { PublishSchoolActivityModal } from './publish-school-activity-modal';

dayjs.extend(LocalizedFormat);

type PublishedDropdownProps = {
  isPublished: boolean;
  schoolActivityId: number;
  lastPublished: string | null;
};

export function PublishDropdown({
  isPublished,
  schoolActivityId,
  lastPublished,
}: PublishedDropdownProps) {
  const { t } = useTranslation(['schoolActivities']);
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const actionText = useMemo(() => {
    if (isPublished) {
      return t('schoolActivities:published');
    }
    if (lastPublished) {
      return t('schoolActivities:unpublished');
    }
    return t('schoolActivities:notPublished');
  }, [isPublished, lastPublished]);

  const styling = useMemo(() => {
    let backgroundColor = 'indigo.500';
    let fontAndIconColor = 'white';
    let IconComponent = CalendarAddIcon;

    if (isPublished) {
      backgroundColor = 'emerald.100';
      fontAndIconColor = 'emerald.500';
      IconComponent = CalendarCheckmarkIcon;
    } else if (lastPublished) {
      backgroundColor = 'red.100';
      fontAndIconColor = 'red.500';
      IconComponent = CalendarCutDottedLinesIcon;
    }

    return { backgroundColor, fontAndIconColor, IconComponent };
  }, [isPublished, lastPublished]);

  const { backgroundColor, fontAndIconColor, IconComponent } = styling;

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if ('key' in event && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
    }
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        id={`publish-button-${schoolActivityId}`}
        aria-controls={`publish-menu-${schoolActivityId}`}
        onClick={handleMenuOpen}
        onKeyDown={handleMenuOpen}
        sx={{
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'slate.200',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            backgroundColor,
            color: fontAndIconColor,
            borderRadius: 2,
            padding: 1,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            height: '25px',
          }}
        >
          <IconComponent
            sx={{ width: 18, height: 18, color: fontAndIconColor }}
          />
          <Typography fontSize="12px" marginLeft={0.5}>
            {actionText}
          </Typography>
        </Box>
        <ChevronDownIcon sx={{ color: 'slategrey' }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        sx={{ maxWidth: 'auto', marginTop: 1 }}
      >
        {lastPublished && (
          <MenuItem
            disabled
            sx={{
              fontSize: '0.875rem',
              '&.Mui-disabled': { opacity: '1' },
            }}
          >
            {t('schoolActivities:lastPublished')}
            <Box component="span" fontWeight={500} marginLeft={1}>
              {dayjs(lastPublished).format('L')}
            </Box>
          </MenuItem>
        )}

        <MenuItem
          disabled={isPublished}
          onClick={() => {
            onOpen();
            handleCloseMenu();
          }}
          sx={{ fontSize: '0.875rem' }}
        >
          <CalendarCheckmarkIcon sx={{ mr: 1 }} />
          {t('schoolActivities:publish')}
        </MenuItem>

        <MenuItem
          disabled={!isPublished}
          onClick={() => {
            onOpen();
            handleCloseMenu();
          }}
          sx={{ fontSize: '0.875rem' }}
        >
          <CalendarCutDottedLinesIcon sx={{ mr: 1 }} />
          {t('schoolActivities:unpublish')}
        </MenuItem>
      </Menu>

      <PublishSchoolActivityModal
        open={isModalOpen}
        onClose={onClose}
        isPublished={isPublished}
        schoolActivityId={schoolActivityId}
      />
    </>
  );
}
