import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import Header from '../Header/index.js';
import Footer from '../Footer/index.js';
import '../../styles.css';
import { AnimationProvider } from '../../context/AnimationContext.js';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import {Analytics, AnalyticsProps} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/react"
import type {SpeedInsightsProps} from '@vercel/speed-insights'
import { RouteErrorDisplay } from '../ErrorBoundary/index.js';
import { isProduction } from 'std-env'; 
import SEO from '../../Components/SEO/index.js';

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
    <SEO />
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
    
    return (
      <>
        <SEO 
          title="Blog - Israel Prempeh | Full Stack Developer"
          description="Read articles and tutorials on React, TypeScript, and modern web development practices."
          url="https://www.israelagyeman.com/blog"
        />
        <div>Redirecting to blog...</div>
      </>
    );
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
  component: () => (
    <>
      <SEO 
        title="Curriculum Vitae - Israel Prempeh"
        description="View the professional experience, education, and skills of Israel Prempeh, Full Stack Developer."
        url="https://www.israelagyeman.com/cv"
      />
      <div>Redirecting to CV...</div>
    </>
  ),
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


export default function Layout() {

  const analyticsProps = useMemo<AnalyticsProps>(() => {
    return isProduction ? { mode: 'production' } : { mode: 'development'};
  }, []);

  const speedInsightsProps = useMemo<SpeedInsightsProps>(() => {
    return isProduction ? { mode: 'production' } : { mode: 'development', debug: true };
  }, []);

  return (
    <AnimationProvider>
      <RouterProvider router={router} />
      <Analytics {...analyticsProps}/>
      <SpeedInsights {...speedInsightsProps} />
    </AnimationProvider>
  );
}
