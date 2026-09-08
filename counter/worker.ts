const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = new Headers({ 'Cache-Control': 'no-store', Vary: 'Origin' });
    // CORS restricts browser use; this is a public gag-site counter, not authentication.
    if (origin === env.ALLOWED_ORIGIN) headers.set('Access-Control-Allow-Origin', origin);
    const json = (body: unknown, status = 200) => Response.json(body, { status, headers });
    if (new URL(request.url).pathname !== '/spins') return json({ error: 'Not found' }, 404);
    if (origin && origin !== env.ALLOWED_ORIGIN) return json({ error: 'Origin not allowed' }, 403);
    if (request.method === 'OPTIONS') {
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      headers.set('Access-Control-Max-Age', '86400');
      return new Response(null, { status: 204, headers });
    }
    try {
      if (request.method === 'GET') {
        const row = await env.DB.prepare('SELECT spins FROM totals WHERE id = 1').first<{ spins: number }>();
        return json({ count: row?.spins ?? 0 });
      }
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
      if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') return json({ error: 'Expected JSON' }, 415);
      // Bound the actual stream, rather than trusting a Content-Length header.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'Missing body' }, 400);
      let size = 0;
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 256) { await reader.cancel(); return json({ error: 'Body too large' }, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      let body: unknown;
      try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({ error: 'Invalid JSON' }, 400); }
      if (!body || typeof body !== 'object' || !('id' in body) || typeof body.id !== 'string' || !uuid.test(body.id) || Object.keys(body).length !== 1) return json({ error: 'Invalid spin ID' }, 400);
      // The unique ID and trigger make retries idempotent. D1 batches execute as
      // a transaction, so simultaneous users cannot lose an increment.
      const results = await env.DB.batch<{ spins: number }>([
        env.DB.prepare('INSERT INTO completed_spins (id) VALUES (?) ON CONFLICT(id) DO NOTHING').bind(body.id.toLowerCase()),
        env.DB.prepare('SELECT spins FROM totals WHERE id = 1'),
      ]);
      return json({ count: results[1].results[0].spins });
    } catch (error) {
      console.error('Counter storage request failed', error instanceof Error ? error.message : 'Unknown error');
      return json({ error: 'Counter temporarily unavailable' }, 503);
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>;
