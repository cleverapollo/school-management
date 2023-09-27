import {
  Box,
  Tooltip,
  Checkbox,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { IconButtonWithTooltip, SearchInput, useResponsive } from '@tyro/core';
import { HamburgerMenuIcon, RefreshIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { useMailSettings } from '../../store/mail-settings';

type MailToolbarProps = {
  onRequestRefresh: () => void;
  onToggleAll: () => void;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  isRefreshing?: boolean;
};

export default function MailToolbar({
  onRequestRefresh,
  onToggleAll,
  filterValue,
  setFilterValue,
  isAllSelected,
  isSomeSelected,
  isRefreshing,
}: MailToolbarProps) {
  const { t } = useTranslation(['mail']);
  const { sidebarDisclosure } = useMailSettings();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Box
      sx={{
        height: 84,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row">
        {!mdUp && (
          <IconButton onClick={sidebarDisclosure.onToggle}>
            <HamburgerMenuIcon />
          </IconButton>
        )}

        {smUp && (
          <>
            {/* <Checkbox
              checked={isSomeSelected || isAllSelected}
              indeterminate={!isAllSelected && isSomeSelected}
              onChange={onToggleAll}
            /> */}
            {isRefreshing ? (
              <Box
                display="flex"
                py={1}
                px={1.25}
                alignItems="center"
                justifyContent="center"
                sx={{
                  transform: 'translateY(1px)',
                }}
              >
                <CircularProgress size={20} color="primary" />
              </Box>
            ) : (
              <IconButtonWithTooltip
                title={t('mail:tooltipTitles.refresh')}
                onClick={onRequestRefresh}
              >
                <RefreshIcon />
              </IconButtonWithTooltip>
            )}
          </>
        )}
      </Stack>

      {/* <SearchInput
        size="small"
        placeholder={t('mail:placeholders.searchMail')}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      /> */}
    </Box>
  );
}
