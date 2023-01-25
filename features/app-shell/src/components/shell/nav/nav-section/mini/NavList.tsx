import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// hooks
import useActiveLink from '../../../../../hooks/use-active-link';
import { StyledPopover } from './styles';
import NavItem from './NavItem';
import {
  NavigationMenuLink,
  NavigationRootGroup,
} from '../../../../../hooks/use-navigation-config';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavigationRootGroup | NavigationMenuLink;
  depth: number;
};

export default function NavList({ data, depth }: NavListRootProps) {
  const navRef = useRef(null);

  const { pathname } = useLocation();

  const { active, isExternalLink } = useActiveLink(data?.path ?? '');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NavItem
        ref={navRef}
        item={data}
        depth={depth}
        open={open}
        active={active}
        isExternalLink={isExternalLink}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      />

      {data.children && (
        <StyledPopover
          open={open}
          anchorEl={navRef.current}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
        >
          <NavSubList data={data.children} depth={depth} />
        </StyledPopover>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavigationMenuLink[];
  depth: number;
};

function NavSubList({ data, depth }: NavListSubProps) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={`${list.title}${list.path ?? ''}`}
          data={list}
          depth={depth + 1}
        />
      ))}
    </>
  );
}
