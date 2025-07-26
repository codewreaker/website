import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from '../Header/index.js';
import Footer from '../Footer/index.js';
import '../../styles.css';
import { startMocking } from '../../mock-service/setup.js';
import { AnimationProvider } from '../../context/AnimationContext.js';
import { lazy, Suspense, useEffect, useState } from 'react';
import { isDev, logVercelEnvVars } from '../../utils/env-utils.js';

const Home = lazy(() => import('../Home/index.js'));
const Blog = lazy(() => import('../Blog/index.js'));

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
    {/* <Footer /> */}
  </>
);

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: Blog,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRedirect,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}



export default function Layout() {
  const [mockingStarted, setMockingStarted] = useState(false);
  console.log(`======SETTING_UP=======`);
  logVercelEnvVars();

  useEffect(() => {
    // Start MSW in development
    if (isDev) {
      startMocking().then(() => {
        setMockingStarted(true);
        console.log('MSW mocking started');
      });
    } else {
      setMockingStarted(true);
    }
  }, []);

  if (isDev && !mockingStarted) {
    return <div>Setting Up MSW...</div>;
  }

  return (
    <AnimationProvider>
      <RouterProvider router={router} />
    </AnimationProvider>
  );
}
