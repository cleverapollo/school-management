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
  Tooltip,
} from '@mui/material';
import { Scrollbar, useDebouncedValue, useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AddIcon } from '@tyro/icons';
import { LabelType, usePermissions } from '@tyro/api';
import { MailSidebarItem } from './item';
import { useMailSettings } from '../../store/mail-settings';
import {
  ReturnTypeFromUseLabels,
  useLabels,
  useUnreadCount,
} from '../../api/labels';
import { LabelDialog } from './label-dialog';

export function MailSidebar() {
  const { pathname } = useLocation();
  const { isStaffUser, isTyroUser } = usePermissions();
  const { t } = useTranslation(['mail', 'common']);
  const { sidebarDisclosure, composeEmail, activeProfileId } =
    useMailSettings();
  const { isOpen: isSidebarOpen, onClose: onCloseSidebar } = sidebarDisclosure;

  const isDesktop = useResponsive('up', 'md');

  const {
    value: openLabelInfo,
    debouncedValue: debouncedOpenLabelInfo,
    setValue: setOpenLabelInfo,
  } = useDebouncedValue<Partial<ReturnTypeFromUseLabels> | null>({
    defaultValue: null,
  });

  const { data: unreadCounts } = useUnreadCount({
    personPartyId: activeProfileId,
  });

  const { data: labels } = useLabels({
    personPartyId: activeProfileId,
  });
  const splitLabels = useMemo(
    () => ({
      standard:
        labels
          ?.filter(({ custom, type }) => !custom && type !== LabelType.Trash)
          .sort((labelA, labelB) => {
            if (labelA.type === LabelType.Inbox) return -1;
            if (labelB.type === LabelType.Inbox) return 1;
            if (labelA.type === LabelType.Outbox) return -1;
            if (labelB.type === LabelType.Outbox) return 1;
            if (labelA.type === LabelType.Trash) return -1;
            if (labelB.type === LabelType.Trash) return 1;
            return 0;
          }) ?? [],
      custom:
        labels
          ?.filter(({ custom }) => custom)
          .sort((labelA, labelB) => labelA.name.localeCompare(labelB.name)) ??
        [],
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
    composeEmail({});
  };

  const composeDisabled = !isStaffUser || isTyroUser;

  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Tooltip
          title={
            composeDisabled && t('mail:youDoNotHavePermissionToComposeNewMail')
          }
        >
          <span>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCompose}
              disabled={composeDisabled}
            >
              {t('common:actions.compose')}
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Divider />

      <List disablePadding>
        {splitLabels.standard.map((label) => (
          <MailSidebarItem
            key={label.id}
            label={label}
            setLabelInfo={setOpenLabelInfo}
            unreadCount={unreadCounts?.get(label.id) ?? 0}
          />
        ))}
      </List>

      {/* Custom label will be re-added when backend is refactored */}
      {/* <Box
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
      </List> */}
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
