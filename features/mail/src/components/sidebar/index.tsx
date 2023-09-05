import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  List,
  Drawer,
  Button,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import { Scrollbar, useDebouncedValue, useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AddIcon } from '@tyro/icons';
import { MailSidebarItem } from './item';
import { useMailSettings } from '../../store/mail-settings';
import { ReturnTypeFromUseLabels, useLabels } from '../../api/labels';
import { LabelDialog } from './label-dialog';

export function MailSidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation(['mail', 'common']);
  const { sidebarDisclosure } = useMailSettings();
  const { isOpen: isSidebarOpen, onClose: onCloseSidebar } = sidebarDisclosure;

  const isDesktop = useResponsive('up', 'md');

  const {
    value: openLabelInfo,
    debouncedValue: debouncedOpenLabelInfo,
    setValue: setOpenLabelInfo,
  } = useDebouncedValue<Partial<ReturnTypeFromUseLabels> | null>({
    defaultValue: null,
  });

  const { data: labels } = useLabels({});
  const splitLabels = useMemo(
    () => ({
      standard: labels?.filter(({ custom }) => !custom) ?? [],
      custom: labels?.filter(({ custom }) => custom) ?? [],
    }),
    [labels]
  );

  useEffect(() => {
    if (isSidebarOpen) {
      onCloseSidebar();
    }
  }, [pathname]);

  const handleOpenCompose = () => {
    onCloseSidebar();
    // TODO: Add open compose from provider
    // onOpenCompose();
  };

  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCompose}
        >
          {t('common:actions.compose')}
        </Button>
      </Box>

      <Divider />

      <List disablePadding>
        {splitLabels.standard.map((label) => (
          <MailSidebarItem
            key={label.id}
            label={label}
            setLabelInfo={setOpenLabelInfo}
          />
        ))}
      </List>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#637381',
          pl: '25px',
          mt: '10px',
          pr: '7px',
        }}
      >
        <Typography variant="body1">{t('mail:labels')}</Typography>
        <IconButton onClick={() => setOpenLabelInfo({})}>
          <AddIcon />
        </IconButton>
      </Box>

      <List disablePadding>
        {splitLabels.custom.map((label) => (
          <MailSidebarItem
            key={label.id}
            label={label}
            setLabelInfo={setOpenLabelInfo}
          />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          PaperProps={{ sx: { width: 260, position: 'relative' } }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={isSidebarOpen}
          onClose={onCloseSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: 260 } }}
        >
          {renderContent}
        </Drawer>
      )}
      <LabelDialog
        open={Boolean(openLabelInfo)}
        labelInfo={openLabelInfo ?? debouncedOpenLabelInfo}
        onClose={() => setOpenLabelInfo(null)}
      />
    </>
  );
}
