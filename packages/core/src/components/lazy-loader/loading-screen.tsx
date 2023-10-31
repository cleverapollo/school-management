import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const StyledRoot = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 9998,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export function LoadingScreen() {
  return (
    <StyledRoot>
      <m.div
        animate={{
          scale: [1, 0.9, 0.9, 1, 1],
          opacity: [1, 0.48, 0.48, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <Box sx={{ width: 64, height: 64 }}>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 400 400"
          >
            <path
              fill="#141442"
              d="M206,227.6v8.7h-7c-8,0-12.9-4.9-12.9-12.9v-15.4h-6.6v-2.1l14.3-15.2h1.9v9.5h10v7.9h-9.8V222
		    	c0,3.5,2,5.5,5.6,5.5H206z"
            />
            <path
              fill="#141442"
              d="M248.7,200l-15.8,35.8c-4.3,9.8-8.2,13.5-16.3,13.5h-4v-8.8h3.4c4.7,0,5.9-1.3,8.2-6.7l0.1-0.3L208.9,200
		    	h10.7l9.7,22.3l9-22.3H248.7z"
            />
            <path
              fill="#141442"
              d="M274.8,199.8v9.2h-4.3c-5.5,0-7.7,2.4-7.7,8.4v18.8H253V200h6.3l1.7,4.4c2.6-3.2,5.9-4.6,10.5-4.6H274.8z"
            />
            <path
              fill="#141442"
              d="M277.4,218.2c0-11,8.4-19.2,19.6-19.2c11.2,0,19.6,8.2,19.6,19.2c0,10.9-8.4,19.1-19.6,19.1
			    C285.8,237.3,277.4,229.1,277.4,218.2z M306.6,218.2c0-5.9-4-9.9-9.7-9.9c-5.6,0-9.7,4.1-9.7,9.9c0,5.9,4,9.9,9.7,9.9
			    C302.6,228.1,306.6,224,306.6,218.2z"
            />
            <path
              fill="#FFBA08"
              d="M226.7,150.6c-23.3,0-45.2,11.4-58.6,30.5v0h42.5l21.4-30.5H226.7z"
            />
            <polygon
              fill="#0404B2"
              points="146.7,150.6 114.2,181.1 125.3,181.1 146.7,150.6"
            />
            <polygon
              fill="#0000FF"
              points="104.8,150.6 83.4,181.1 114.2,181.1 146.7,150.6 "
            />
            <polygon
              fill="#0092FF"
              points="168,181.1 146.7,150.6 146.7,150.6 125.3,181.1 104,211.6 104,211.6 125.3,242.1 125.3,242.1 
		    	168,181.2"
            />
          </svg>
        </Box>
      </m.div>

      <Box
        component={m.div}
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 100,
          height: 100,
          position: 'absolute',
          border: (theme) =>
            `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 120,
          height: 120,
          position: 'absolute',
          border: (theme) =>
            `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />
    </StyledRoot>
  );
}
