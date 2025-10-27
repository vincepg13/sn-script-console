// IMPORTANT - JS polyfills for SN
import '@/polyfills/array-from-iterable';
import '@/polyfills/array-entries.ts';

import React from 'react';
import './index.build.css';
import { makeRouter } from './router';
import ReactDOM, { Root } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { queryClient } from './queryClient';
import { configQuery } from './lib/init-shadkit';
import { FontProvider } from './context/font-context';
import { ThemeProvider } from './context/theme-context';
import { QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query';
import { AppProvider } from './context/app-context.tsx';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';
import FatalError from './routes/errors/FatalError.tsx';

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'sn-app-config',
});

const router = makeRouter();
const container = document.getElementById('root')!;
type AnyContainer = HTMLElement & { __reactRoot?: Root };

// --- Error boundary used during bootstrap ---
export class RedirectTo500Boundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state: Readonly<{ hasError: boolean }> = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('Bootstrap error:', error, info);
  }

  render() {
    return this.state.hasError ? <FatalError /> : this.props.children;
  }
}

// --- App bootstrapping (uses Suspense for initial config) ---
function AppBootstrap() {
  const { data: config } = useSuspenseQuery(configQuery);

  return (
    <ThemeProvider defaultTheme="light" themeStorageKey="shadcn.template.theme" widthStorageKey="shadcn.template.width">
      <FontProvider>
        <AppProvider config={config}>
          {/* {isFetching && <TopBarSpinner />} */}
          <RouterProvider router={router} />
        </AppProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

// --- Create or reuse the root (prevents duplicate roots on HMR) ---
const c = container as AnyContainer;
const root: Root = c.__reactRoot ?? ReactDOM.createRoot(container);
c.__reactRoot = root;

// --- Render ---
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RedirectTo500Boundary>
        <React.Suspense fallback={<div className="p-6">Loading app…</div>}>
          <AppBootstrap />
        </React.Suspense>
      </RedirectTo500Boundary>
    </QueryClientProvider>
  </React.StrictMode>
);

// --- HMR cleanup: unmount the root so the next eval can mount cleanly ---
if (import.meta && import.meta.hot) {
  import.meta.hot.dispose(() => {
    root.unmount();
    delete (c as AnyContainer).__reactRoot;
  });
}
