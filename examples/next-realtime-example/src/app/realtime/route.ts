import { NextRequest } from 'next/server';
import { NextRealtimeStreamHandler } from './config';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) => NextRealtimeStreamHandler(request);
