import { useState } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
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

const getStyling = (
  publishedStatus: boolean,
  lastPublishedStatus: string | null
) => {
  let backgroundColor = 'indigo.500';
  let fontAndIconColor = 'white';
  let IconComponent = CalendarAddIcon;

  if (!publishedStatus && lastPublishedStatus) {
    backgroundColor = 'red.100';
    fontAndIconColor = 'red.500';
    IconComponent = CalendarCutDottedLinesIcon;
  } else if (publishedStatus) {
    backgroundColor = 'emerald.100';
    fontAndIconColor = 'emerald.500';
    IconComponent = CalendarCheckmarkIcon;
  }

  return { backgroundColor, fontAndIconColor, IconComponent };
};

const getActionText = (
  publishStatus: boolean,
  lastPublishedStatus: string | null,
  translate: TFunction<'schoolActivities'[], undefined, 'schoolActivities'[]>
) => {
  if (!publishStatus && lastPublishedStatus) {
    return translate('schoolActivities:unpublished');
  }
  if (publishStatus) {
    return translate('schoolActivities:published');
  }
  return translate('schoolActivities:notPublished');
};

export function PublishDropdown({
  isPublished,
  schoolActivityId,
  lastPublished,
}: PublishedDropdownProps) {
  const { t } = useTranslation(['schoolActivities']);
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const { backgroundColor, fontAndIconColor, IconComponent } = getStyling(
    isPublished,
    lastPublished
  );

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        id={`publish-button-${schoolActivityId}`}
        aria-controls={`publish-menu-${schoolActivityId}`}
        onClick={handleMenuOpen}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleMenuOpen(event);
          }
        }}
        sx={{
          backgroundColor: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px',
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
            {getActionText(isPublished, lastPublished, t)}
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
            {dayjs(lastPublished).format('DD-MM-YYYY')}
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
