// mocks/setup.js
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';
//import { HttpHandler } from 'msw';

// For browser environment
export const worker = setupWorker(...handlers);

// const getServer = async (handlers: HttpHandler[]) => {
//   if (typeof window === 'undefined') {
//     try {
//       const { setupServer } = await import(/* webpackIgnore: true */ "msw/node");
//       return setupServer(...handlers);
//     } catch (error) {
//       // Fallback if import fails
//       console.warn('Failed to load msw/node:', error);
//       return null;
//     }
//   }
//   return null;
// };

// // For Node.js environment (testing)
// export const server = await getServer(handlers);

// Setup function for browser
export const startMocking = async () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  } else {
    throw new Error("Node Environment")
    // console.log('Node Environment');
    // // Node.js environment
    // server?.listen({
    //   onUnhandledRequest: 'bypass',
    // });
  }
};
