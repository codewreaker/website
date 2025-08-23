
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
    req: VercelRequest,
    res: VercelResponse,
    allowedOrigins: string[] = [
        'http://localhost:3001',
        'http://localhost:4200',
        'http://localhost:5173', // Vite dev server
        'http://127.0.0.1:5500', // Live Server
        'https://israelprempeh.com', // Replace with your actual domain
        'https://blog.israelprempeh.com', // 
        'https://docs.israelprempeh.com', // 
        // Add other allowed origins as needed
    ]) {
    const origin = req.headers.origin;
    const corsHeaders = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin! : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
}