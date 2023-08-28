import { useEffect, useState } from 'react';

export interface ContextMenuValue {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
  points: Points;
  setPoints: (points: Points) => void;
}

export interface Points {
  x: number;
  y: number;
}
export function useContextMenu(): ContextMenuValue {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const handleClick = () => setClicked(false);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  return {
    clicked,
    setClicked,
    points,
    setPoints,
  };
}
