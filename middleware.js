import { NextResponse } from 'next/server';

// In-Memory Token Bucket / Sliding-Window Rate Limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 80;  // 80 requests per minute per IP
const MAX_API_REQUESTS = 40;         // 40 API requests per minute per IP

// Blocklist of automated malicious scanners & attack tools
const MALICIOUS_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'masscan',
  'nmap',
  'wpscan',
  'dirbuster',
  'gobuster',
  'acunetix',
  'havij',
  'zgrab',
  'hydra'
];

// Clean up stale rate-limit keys every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // 1. Cybersecurity Shield: Block Malicious Scanners & Probes
  for (const maliciousUA of MALICIOUS_USER_AGENTS) {
    if (userAgent.includes(maliciousUA)) {
      return new NextResponse(
        JSON.stringify({ error: 'Access Denied: Malicious Security Signature Detected' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Cybersecurity Shield: Path Traversal & Injection Defense
  const rawUrl = decodeURIComponent(pathname + search).toLowerCase();
  if (
    rawUrl.includes('../') ||
    rawUrl.includes('..\\') ||
    rawUrl.includes('<script') ||
    rawUrl.includes('javascript:') ||
    rawUrl.includes('%00') ||
    rawUrl.includes('etc/passwd')
  ) {
    return new NextResponse(
      JSON.stringify({ error: 'Blocked: Illegal Request Pattern' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Sliding-Window IP Rate Limiter
  const isApiRoute = pathname.startsWith('/api/');
  const maxAllowed = isApiRoute ? MAX_API_REQUESTS : MAX_REQUESTS_PER_WINDOW;
  const now = Date.now();

  let clientData = rateLimitMap.get(clientIp);
  if (!clientData || now - clientData.startTime > RATE_LIMIT_WINDOW) {
    clientData = { count: 1, startTime: now };
    rateLimitMap.set(clientIp, clientData);
  } else {
    clientData.count++;
  }

  const remaining = Math.max(0, maxAllowed - clientData.count);
  const resetTime = Math.ceil((clientData.startTime + RATE_LIMIT_WINDOW - now) / 1000);

  if (clientData.count > maxAllowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again shortly.',
        retryAfterSeconds: resetTime
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(resetTime),
          'X-RateLimit-Limit': String(maxAllowed),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(resetTime)
        }
      }
    );
  }

  // Continue request with security rate-limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(maxAllowed));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(resetTime));
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
