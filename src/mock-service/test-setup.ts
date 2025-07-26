// // Testing setup
// // tests/setup.js
// import { beforeAll, afterEach, afterAll } from 'vitest'
// import { server } from './setup.js'

// // Start server before all tests
// beforeAll(() => server?.listen({ onUnhandledRequest: 'error' }))

// // Reset handlers after each test
// afterEach(() => server?.resetHandlers())

// // Close server after all tests
// afterAll(() => server?.close())