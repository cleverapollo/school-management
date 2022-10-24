import { m } from 'framer-motion';
// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets';
import {useTypedSelector} from "../store/store";
import {intersection} from "lodash";

// ----------------------------------------------------------------------

type PermissionBasedGuardProp = {
  hasContent?: boolean;
  permissions?: string[];
  children: React.ReactNode;
};

export default function PermissionBasedGuard({ hasContent, permissions, children }: PermissionBasedGuardProp) {
  // Logic here to get current user role
  const hasPermissions = useTypedSelector((state) => state.auth.permissions);

  // const currentRole = 'user';
  if (typeof permissions !== 'undefined' && intersection(permissions ?? [], hasPermissions).length == 0 ) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
