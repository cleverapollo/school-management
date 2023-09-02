import { ComponentType, lazy, LazyExoticComponent } from 'react';

const key = 'tyro:page-refreshed-forced';

export const lazyWithRetry = <T extends ComponentType<any>>(
  factory: () => Promise<{
    default: T;
  }>
): LazyExoticComponent<T> =>
  // @ts-expect-error
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem(key) || 'false'
    ) as boolean;

    try {
      const component = await factory();

      window.localStorage.setItem(key, 'false');

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.localStorage.setItem(key, 'true');
        return window.location.reload();
      }

      // The page has already been reloaded
      // Assuming that user is already using the latest version of the application.
      // Let's let the application crash and raise the error.
      throw error;
    }
  });
