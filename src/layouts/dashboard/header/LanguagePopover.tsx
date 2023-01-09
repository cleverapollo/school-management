import { useMemo, useState } from 'react';
// @mui
import { ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
// components
import Image from '../../../components/Image';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
// config
import { allLangs } from '../../../config';
import { useTranslation } from '@tyro/i18n';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const { t, i18n } = useTranslation(['authentication']);
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const currentLang = useMemo(() => {
    return allLangs.find((lang) => lang.value === i18n.language) ?? allLangs[0];
  }, [i18n.language]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const onClickItem = (value: string) => {
    i18n.changeLanguage(value);
    handleClose();
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && { bgcolor: 'action.selected' }),
        }}
      >
        <Image disabledEffect src={currentLang.icon} alt={currentLang.label} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {allLangs.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => onClickItem(option.value)}
            >
              <ListItemIcon>
                <Image
                  disabledEffect
                  alt={option.label}
                  src={option.icon}
                  sx={{ width: 28, mr: 2 }}
                />
              </ListItemIcon>
              <ListItemText>{t(`authentication:${option.label}`)}</ListItemText>
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
