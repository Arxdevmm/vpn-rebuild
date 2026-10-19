export type Protocol = 'vless' | 'vmess' | 'trojan' | 'shadowsocks';
export type ServerNode = { id: string; name: string; protocol: Protocol; address: string; port: number; credential: string; ping: number; country: string; flag: string; network: string; security: string; params: Record<string, string>; demo?: boolean; source?: string };
export type ClientSettings = { dns: string; customDns: string; routing: string; protocols: Protocol[] };
export const defaultSettings: ClientSettings = { dns: '1.1.1.1', customDns: '', routing: 'Bypass LAN', protocols: ['vless', 'vmess', 'trojan', 'shadowsocks'] };
export const presetNodes: [ServerNode, ...ServerNode[]] = [
  { id: 'sg-01', name: 'Singapore · SG-01', protocol: 'vless', address: 'sg.example.com', port: 443, credential: 'a1b2c3d4-1111-4111-8111-123456789abc', ping: 24, country: 'Singapore', flag: '🇸🇬', network: 'tcp', security: 'tls', params: { sni: 'sg.example.com' }, demo: true },
  { id: 'jp-02', name: 'Tokyo · JP-02', protocol: 'vmess', address: 'jp.example.com', port: 443, credential: 'a1b2c3d4-2222-4222-8222-123456789abc', ping: 46, country: 'Japan', flag: '🇯🇵', network: 'ws', security: 'tls', params: { path: '/connect', sni: 'jp.example.com' }, demo: true },
  { id: 'de-03', name: 'Frankfurt · DE-03', protocol: 'trojan', address: 'de.example.com', port: 443, credential: 'demo-password', ping: 112, country: 'Germany', flag: '🇩🇪', network: 'tcp', security: 'tls', params: {}, demo: true },
  { id: 'us-04', name: 'Los Angeles · US-04', protocol: 'shadowsocks', address: 'us.example.com', port: 8388, credential: 'demo-password', ping: 168, country: 'United States', flag: '🇺🇸', network: 'tcp', security: 'none', params: { method: 'aes-256-gcm' }, demo: true },
];
export function decodeBase64(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}
function validateNode(node: ServerNode): ServerNode {
  if (!node.address || !node.credential || !Number.isInteger(node.port) || node.port < 1 || node.port > 65535) throw new Error('A server address, credential and valid port (1–65535) are required.');
  if (['vless', 'vmess'].includes(node.protocol) && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(node.credential)) throw new Error('VLESS and VMess require a valid UUID.');
  if (!['tcp', 'ws', 'grpc', 'http', 'httpupgrade', 'xhttp', 'kcp'].includes(node.network)) throw new Error(`Unsupported transport: ${node.network}`);
  if (!['none', 'tls', 'reality'].includes(node.security)) throw new Error(`Unsupported security: ${node.security}`);
  if (node.security === 'reality' && !node.params['pbk']) throw new Error('Reality requires a public key (pbk).');
  return node;
}
export function parseUri(raw: string): ServerNode {
  const uri = raw.trim();
  const safeId = 'node-' + Array.from(uri).reduce((hash, c) => (Math.imul(hash, 31) + c.charCodeAt(0)) | 0, 0).toString(16);
  const base: ServerNode = { id: safeId, name: 'Imported server', protocol: 'vless', address: '', port: 443, credential: '', ping: 0, country: 'Custom server', flag: '🌐', network: 'tcp', security: 'none', params: {} };
  try {
    if (uri.startsWith('vmess://')) {
      const data = JSON.parse(decodeBase64(uri.slice(8))) as Record<string, unknown>;
      const params: Record<string, string> = {};
      for (const key of ['path', 'host', 'sni', 'alpn', 'fp', 'aid', 'scy', 'type']) if (data[key] != null) params[key] = String(data[key]);
      return validateNode({ ...base, protocol: 'vmess', name: String(data['ps'] || 'VMess server'), address: String(data['add'] || ''), port: Number(data['port']), credential: String(data['id'] || ''), network: String(data['net'] || 'tcp'), security: String(data['tls'] || 'none'), params });
    }
    if (uri.startsWith('ss://')) {
      const [body = '', fragment] = uri.slice(5).split('#');
      const [authority = '', query] = body.split('?');
      let expanded = authority;
      if (!authority.includes('@')) expanded = decodeBase64(authority);
      const split = expanded.lastIndexOf('@');
      if (split < 0) throw new Error('Missing Shadowsocks host.');
      let auth = expanded.slice(0, split);
      if (!auth.includes(':')) auth = decodeBase64(auth);
      const colon = auth.indexOf(':');
      const method = auth.slice(0, colon);
      if (!['aes-128-gcm', 'aes-256-gcm', 'chacha20-ietf-poly1305', '2022-blake3-aes-128-gcm', '2022-blake3-aes-256-gcm', '2022-blake3-chacha20-poly1305'].includes(method)) throw new Error('Unsupported Shadowsocks cipher.');
      const url = new URL('https://' + expanded.slice(split + 1));
      const plugin = new URLSearchParams(query).get('plugin');
      if (plugin) throw new Error('Shadowsocks plugins require a native plugin executable and cannot be exported by this client.');
      return validateNode({ ...base, protocol: 'shadowsocks', name: fragment ? decodeURIComponent(fragment) : 'Shadowsocks server', address: url.hostname.replace(/^\[|\]$/g, ''), port: Number(url.port || 443), credential: decodeURIComponent(auth.slice(colon + 1)), params: { method } });
    }
    if (!/^(vless|trojan):\/\//.test(uri)) throw new Error('Use a vmess://, vless://, trojan:// or ss:// link.');
    const url = new URL(uri);
    const protocol = url.protocol === 'vless:' ? 'vless' : 'trojan';
    const params = Object.fromEntries(url.searchParams);
    return validateNode({ ...base, protocol, name: url.hash ? decodeURIComponent(url.hash.slice(1)) : `${protocol.toUpperCase()} server`, address: url.hostname.replace(/^\[|\]$/g, ''), port: Number(url.port || 443), credential: decodeURIComponent(url.username + (url.password ? ':' + url.password : '')), network: params['type'] || 'tcp', security: params['security'] || (protocol === 'trojan' ? 'tls' : 'none'), params });
  } catch (error) { throw new Error(error instanceof Error ? error.message : 'Invalid configuration link.'); }
}
export function parseSubscription(text: string): ServerNode[] {
  const content = /^(vmess|vless|trojan|ss):\/\//.test(text.trim()) ? text : decodeBase64(text.trim());
  const lines = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (!lines.length) throw new Error('The subscription contains no servers.');
  return lines.map(parseUri);
}
export function createManualNode(input: Partial<ServerNode>): ServerNode { return validateNode({ ...presetNodes[0], ...input, demo: false, id: 'manual-' + Date.now(), ping: 0, flag: '🌐', country: 'Custom server' }); }
export function makeConfig(node: ServerNode, settings: ClientSettings = defaultSettings) {
  const p = node.params;
  const stream: Record<string, unknown> = { network: node.network, security: node.security };
  if (node.security === 'tls') stream['tlsSettings'] = { serverName: p['sni'] || node.address, fingerprint: p['fp'] || 'chrome', ...(p['alpn'] ? { alpn: p['alpn'].split(',') } : {}) };
  if (node.security === 'reality') stream['realitySettings'] = { serverName: p['sni'] || node.address, fingerprint: p['fp'] || 'chrome', publicKey: p['pbk'], shortId: p['sid'] || '', spiderX: p['spx'] || '/' };
  if (node.network === 'ws') stream['wsSettings'] = { path: p['path'] || '/', ...(p['host'] ? { headers: { Host: p['host'] } } : {}) };
  if (node.network === 'grpc') stream['grpcSettings'] = { serviceName: p['serviceName'] || p['path'] || '', multiMode: p['mode'] === 'multi' };
  if (node.network === 'http') stream['httpSettings'] = { path: p['path'] || '/', host: p['host'] ? p['host'].split(',') : [node.address] };
  if (node.network === 'httpupgrade' || node.network === 'xhttp') stream[`${node.network}Settings`] = { path: p['path'] || '/', host: p['host'] || node.address };
  if (node.network === 'kcp') stream['kcpSettings'] = { header: { type: p['type'] || 'none' } };
  const user = node.protocol === 'vmess' ? { id: node.credential, alterId: Number(p['aid'] || 0), security: p['scy'] || 'auto' } : { id: node.credential, encryption: 'none', ...(p['flow'] ? { flow: p['flow'] } : {}) };
  const outbound = { tag: 'proxy', protocol: node.protocol, settings: ['vless', 'vmess'].includes(node.protocol) ? { vnext: [{ address: node.address, port: node.port, users: [user] }] } : { servers: [{ address: node.address, port: node.port, password: node.credential, ...(node.protocol === 'shadowsocks' ? { method: p['method'] } : {}) }] }, streamSettings: stream };
  const rules: Record<string, unknown>[] = [];
  if (settings.routing !== 'Global') rules.push({ type: 'field', ip: ['geoip:private'], outboundTag: 'direct' });
  if (settings.routing === 'Bypass Mainland/Domestic') rules.push({ type: 'field', ip: ['geoip:cn'], outboundTag: 'direct' }, { type: 'field', domain: ['geosite:cn'], outboundTag: 'direct' });
  if (settings.routing === 'Rule-based') rules.push({ type: 'field', domain: ['geosite:category-ads-all'], outboundTag: 'block' });
  return { log: { loglevel: 'none' }, dns: { servers: [settings.dns === 'custom' ? settings.customDns || '1.1.1.1' : settings.dns] }, inbounds: [{ tag: 'socks', listen: '127.0.0.1', port: 10808, protocol: 'socks', settings: { udp: true } }, { tag: 'http', listen: '127.0.0.1', port: 10809, protocol: 'http', settings: {} }], outbounds: [outbound, { tag: 'direct', protocol: 'freedom', settings: {} }, { tag: 'block', protocol: 'blackhole', settings: {} }] as [typeof outbound, { tag: string; protocol: string; settings: Record<string, unknown> }, { tag: string; protocol: string; settings: Record<string, unknown> }], routing: { domainStrategy: 'IPIfNonMatch', rules } };
}