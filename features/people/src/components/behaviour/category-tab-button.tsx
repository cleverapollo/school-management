import { Box, Button } from '@mui/material';

interface CategoryTagButtonProps {
  isActive: boolean;
  dotColor: string;
  label: string;
  onClick: () => void;
}

export function CategoryTagButton({
  isActive,
  dotColor,
  label,
  onClick,
}: CategoryTagButtonProps) {
  return (
    <Button
      onClick={onClick}
      sx={{
        borderRadius: 1,
        backgroundColor: isActive ? 'indigo.50' : ' transparent',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: isActive ? 'indigo.500' : 'slate.300',
        color: isActive ? 'indigo.500' : 'slate.400',
        height: '30px',
      }}
    >
      <Box
        sx={{
          width: '9px',
          height: '9px',
          display: 'flex',
          borderRadius: '50%',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: dotColor,
          marginRight: 1,
        }}
      />
      {label}
    </Button>
  );
}
