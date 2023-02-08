// @mui
import { alpha, styled } from '@mui/material/styles';
import { Card, CardProps, Typography } from '@mui/material';
// utils
// theme
// components

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
}

export default function AnalyticsWidgetSummary({
  title,
  total,
  color = 'primary',
  sx,
  ...other
}: Props) {
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => 'white.500',
        bgcolor: (theme) => 'green.500',
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => '#fff',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha('#123', 0)} 0%, ${alpha(
              '#123',
              0.24
            )} 100%)`,
        }}
      />

      <Typography variant="h3">{total}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}
