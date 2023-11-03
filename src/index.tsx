// i18n
import '@tyro/i18n';
import * as Sentry from '@sentry/react';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import App from './App';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://6f0dc905b3566329a24bf2f3ab3efc64@o4505675714658304.ingest.sentry.io/4505680217964544",
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [/^https:\/\/app\.tyro\.school\/api/],
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: 0.5,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
