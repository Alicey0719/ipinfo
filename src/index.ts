const SECURITY_HEADERS: HeadersInit = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Access-Control-Allow-Origin': '*',
};

const CF_FIELDS = [
  'asn', 'asOrganization',
  'city', 'region', 'regionCode', 'country',
  'latitude', 'longitude',
  'postalCode', 'timezone',
] as const;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2) + '\n', {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return json({ error: 'Method Not Allowed' }, 405);
    }

    const connectingIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const xff = request.headers.get('X-Forwarded-For');
    const forwardedFor = xff ? xff.split(',').map(s => s.trim()) : [connectingIp];
    const cf = (request.cf ?? {}) as Record<string, unknown>;

    const result: Record<string, unknown> = { connectingIp, forwardedFor };
    for (const key of CF_FIELDS) {
      if (cf[key] !== undefined) result[key] = cf[key];
    }

    return json(result);
  },
};
