import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import Header from '../Header/index.js';
import Footer from '../Footer/index.js';
import '../../styles.css';
import { startMocking } from '../../mock-service/setup.js';
import { AnimationProvider } from '../../context/AnimationContext.js';
import { lazy, Suspense, useEffect, useState } from 'react';
import { isDev, logVercelEnvVars } from '../../utils/env-utils.js';
import { RouteErrorDisplay } from '../ErrorBoundary/index.js';

const Home = lazy(() => import('../Home/index.js'));

const adminUrl = 'http://localhost:4201/admin'; // Change to your admin port

function AdminRedirect() {
  useEffect(() => {
    window.location.replace(adminUrl);
  }, []);
  return <div>Redirecting to admin...</div>;
}

const RootComponent = () => (
  <>
    <Header />
    <main className="layout-content">
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </>
);

const rootRoute = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => <RouteErrorDisplay error={error as Error} />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => {
    useEffect(() => {
      window.location.href = 'https://blog.israelprempeh.com';
    }, []);
    
    return <div>Redirecting to blog...</div>;
  },
  errorComponent: ({ error }) => <RouteErrorDisplay error={error as Error} />
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRedirect,
});

const cvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cv',
  beforeLoad: () => {
    throw redirect({
      to: '/',
      hash: 'cv'
    });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute,
  adminRoute,
  cvRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const ERROR_MSG = 'Production environment detected: MSW initialization skipped. Verify Vercel environment configuration and VITE_PREPROD flag for pre-production features.'


export default function Layout() {
  //const [mockingStarted, setMockingStarted] = useState(false);
  console.log(`======SETTING_UP=======`);

  // useEffect(() => {
  //   // Start MSW in development
  //   if (isDev) {
  //     startMocking().then(() => {
  //       setMockingStarted(true);
  //       console.log('MSW mocking started');
  //     });
  //   } else {
  //     // Log Vercel environment variables in production
  //     logVercelEnvVars();
  //     console.error(ERROR_MSG);
  //     setMockingStarted(true);
  //   }
  // }, []);


  // if (isDev && !mockingStarted) {
  //   return <div>Setting Up MSW...</div>;
  // }

  return (
    <AnimationProvider>
      <RouterProvider router={router} />
    </AnimationProvider>
  );
}
