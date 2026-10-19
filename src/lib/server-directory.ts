import { decodeBase64, parseUri, type ServerNode } from './v2ray';

export const directorySource = { name: 'FastNodes', repository: 'https://github.com/rtwo2/FastNodes', base: 'https://raw.githubusercontent.com/rtwo2/FastNodes/main/sub/' };
export type DirectorySort = 'name' | 'location' | 'latency' | 'rating';
export type Ratings = Record<string, number>;
export const ratingsKey = 'ai-v2ray-personal-ratings-v1';
export function readRatings(text: string | null): Ratings {
  try {
    const value: unknown = JSON.parse(text || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([key, rating]) => key.startsWith('node-') && typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5));
  } catch { return {}; }
}
export function countryName(code: string): string {
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch { return code; }
}
export function parseDirectory(text: string, countryCode?: string) {
  if (text.length > 2_000_000) throw new Error('Directory feed exceeds the size limit.');
  const content = /^(vless|vmess|trojan|ss):\/\//m.test(text) ? text : decodeBase64(text.trim());
  const nodes: ServerNode[] = []; const seen = new Set<string>(); let skipped = 0;
  const lines = content.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));
  for (const line of lines.slice(0, 5000)) {
    try {
      const node = parseUri(line);
      if (seen.has(node.id)) continue;
      seen.add(node.id);
      // Use the source's country feed, not an unverified name/flag embedded in a URI.
      nodes.push({ ...node, name: `${node.protocol.toUpperCase()} · ${nodes.length + 1}`, country: countryCode ? countryName(countryCode) : 'Unknown', flag: countryCode ? String.fromCodePoint(...Array.from(countryCode).map(c => 127397 + c.charCodeAt(0))) : '🌐', source: directorySource.name, ping: 0 });
    } catch { skipped++; }
  }
  return { nodes, skipped, truncated: lines.length > 5000 };
}
export function sortDirectory(nodes: ServerNode[], sort: DirectorySort, ratings: Ratings): ServerNode[] {
  return [...nodes].sort((a, b) => {
    const tie = a.name.localeCompare(b.name, undefined, { numeric: true });
    if (sort === 'rating') return (ratings[b.id] || 0) - (ratings[a.id] || 0) || tie;
    if (sort === 'location') return a.country.localeCompare(b.country) || tie;
    if (sort === 'latency') return (a.ping > 0 ? a.ping : Infinity) - (b.ping > 0 ? b.ping : Infinity) || tie;
    return tie;
  });
}
export async function fetchDirectory(countryCode: string, signal: AbortSignal) {
  if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) throw new Error('Invalid country.');
  const url = directorySource.base + (countryCode ? `countries/${countryCode}.txt` : 'top.txt');
  const response = await fetch(url, { credentials: 'omit', referrerPolicy: 'no-referrer', signal });
  if (!response.ok) throw new Error(`Directory returned ${response.status}. Try another country or refresh.`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Directory response unavailable.');
  let size = 0; const decoder = new TextDecoder(); let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2_000_000) throw new Error('Directory feed exceeds the size limit.');
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
  return { ...parseDirectory(text, countryCode || undefined), fetchedAt: new Date().toISOString() };
}