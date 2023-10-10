import { Button, Stack, Typography } from '@mui/material';
import { Person } from '@tyro/api';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';

type BottomGradientLinkProps = Partial<Person> & { onClose: () => void };

export function BottomGradientLink(props: BottomGradientLinkProps) {
  const { t } = useTranslation(['people']);
  const { displayName } = usePreferredNameLayout();
  const { partyId, avatarUrl, onClose } = props;
  const name = displayName(props);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      position="absolute"
      bottom={0}
      left={0}
      width="100%"
      p={3}
      pt={5}
      sx={{
        background:
          'linear-gradient(180deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 0.8) 100%)',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar name={name} src={avatarUrl} />
        <Typography variant="subtitle2" color="white">
          {name}
        </Typography>
      </Stack>

      <Button
        component={Link}
        variant="contained"
        color="inherit"
        to={`/people/students/${partyId ?? 0}`}
        onClick={onClose}
        sx={{
          backgroundColor: 'white',
          color: 'indigo.600',
          borderRadius: 2.5,
        }}
      >
        {t('people:fullProfile')}
      </Button>
    </Stack>
  );
}
