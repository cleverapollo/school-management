/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useState, useMemo } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { useTranslation, availableLanguages } from '@tyro/i18n';
import { FlagEnIcon, FlagGaIcon } from '@tyro/icons';
import MenuPopover from '../../../../../../src/components/menu-popover';
import { IconButtonAnimate } from '../../../../../../src/components/animate';

export const iconsForList = {
  en: <FlagEnIcon />,
  ga: <FlagGaIcon />,
};

export default function LanguagePopover() {
  const { t, i18n } = useTranslation(['settings']);
  const currentLanguage = useMemo(() => {
    const currentLanguageCode =
      i18n.language as (typeof availableLanguages)[number];
    return {
      code: currentLanguageCode,
      icon: iconsForList[currentLanguageCode],
      label: t(`settings:language.${currentLanguageCode}`),
    };
  }, [i18n.language]);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangeLang = (newLang: string) => {
    i18n.changeLanguage(newLang);
    handleClosePopover();
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && {
            bgcolor: 'action.selected',
          }),
        }}
        aria-label={`Click to change language. Current language is ${currentLanguage.label}`}
      >
        <Box
          sx={{
            width: 24,
            height: 18,
            display: 'flex',
            borderRadius: 0.5,
            overflow: 'hidden',
          }}
        >
          {currentLanguage.icon}
        </Box>
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{
          minWidth: 180,
          '& .MuiMenuItem-root svg': {
            height: 21,
            width: 28,
          },
        }}
      >
        <Stack spacing={0.75}>
          {availableLanguages.map((code) => (
            <MenuItem
              key={code}
              selected={code === currentLanguage.code}
              onClick={() => handleChangeLang(code)}
            >
              <Box
                sx={{
                  width: 28,
                  height: 21,
                  display: 'flex',
                  borderRadius: 0.5,
                  overflow: 'hidden',
                  mr: 1.5,
                }}
              >
                {iconsForList[code]}
              </Box>

              {t(`settings:language.${code}`)}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
