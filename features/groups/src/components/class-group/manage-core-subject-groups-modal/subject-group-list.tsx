import { Stack } from '@mui/material';

export function SubjectGroupListContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack
      component="ul"
      sx={{
        mx: 0,
        my: 1,
        px: 0,
        maxHeight: '50vh',
        overflowY: 'auto',
        '@media (hover: hover) and (pointer: fine)': {
          '& li button': {
            opacity: 0,
          },

          '& li:focus-within, & li:hover': {
            bgcolor: 'primary.lighter',

            '& button': {
              opacity: 1,
            },
          },
        },
      }}
    >
      {children}
    </Stack>
  );
}

interface SubjectGroupListItemProps {
  children: React.ReactNode;
}

export function SubjectGroupListItem({ children }: SubjectGroupListItemProps) {
  return (
    <Stack
      component="li"
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        py: 1,
        px: 2,
        borderRadius: 1.5,
        justifyContent: 'space-between',
      }}
    >
      <Stack alignItems="flex-start" flex="1">
        {children}
      </Stack>
    </Stack>
  );
}
