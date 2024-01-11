export function onLongPress<TouchEventElement>(
  functionToCall: (event: React.TouchEvent<TouchEventElement>) => unknown,
  {
    pressDelay,
    onTouchStart,
    onTouchEnd,
  }: {
    pressDelay: number;
    onTouchStart?: (event: React.TouchEvent<TouchEventElement>) => unknown;
    onTouchEnd?: (event: React.TouchEvent<TouchEventElement>) => unknown;
  } = { pressDelay: 500 }
): {
  onTouchStart: (event: React.TouchEvent<TouchEventElement>) => void;
  onTouchEnd: (event: React.TouchEvent<TouchEventElement>) => void;
} {
  let longPressTimeout: ReturnType<typeof setTimeout> | undefined;

  return {
    onTouchStart: (event: React.TouchEvent<TouchEventElement>) => {
      console.log('long press started');
      longPressTimeout = setTimeout(() => {
        console.log('long press called', {
          functionToCall,
          event,
        });
        if (onTouchStart) {
          onTouchStart(event);
        }
        longPressTimeout = undefined;
        functionToCall(event);
      }, pressDelay);
    },
    onTouchEnd: (event: React.TouchEvent<TouchEventElement>) => {
      console.log('long press ended');
      if (longPressTimeout) {
        console.log('long press time cleared');
        if (onTouchEnd) {
          onTouchEnd(event);
        }
        clearTimeout(longPressTimeout);
        longPressTimeout = undefined;
      }
    },
  };
}
