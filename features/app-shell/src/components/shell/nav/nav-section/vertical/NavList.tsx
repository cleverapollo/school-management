import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Collapse } from '@mui/material';
import useActiveLink from '../../../../../hooks/use-active-link';
import NavItem from './NavItem';
import {
  NavigationMenuLink,
  NavigationRootGroup,
} from '../../../../../hooks/use-navigation-config';

type NavListRootProps = {
  data: NavigationRootGroup | NavigationMenuLink;
  depth: number;
};

export default function NavList({ data, depth }: NavListRootProps) {
  const { pathname } = useLocation();

  const { active, isExternalLink } = useActiveLink(data.path ?? '');

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        isExternalLink={isExternalLink}
        onClick={handleToggle}
      />

      {data.children && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} />
        </Collapse>
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
