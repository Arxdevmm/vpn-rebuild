import { describe, expect, it } from 'vitest';
import { parseDirectory, readRatings, sortDirectory } from './server-directory';
import { acceptNativeTraffic, nativeConnectRequest, unavailableNativeVpn } from './native-vpn';
import { defaultSettings } from './v2ray';
const uri = 'vless://a1b2c3d4-1111-4111-8111-123456789abc@example.com:443#Fake-Japan';
describe('Public directory', () => {
  it('parses locally, skips unsupported entries, deduplicates and distrusts names', () => {
    const result = parseDirectory(`${uri}\n${uri}\nhysteria2://unsupported\ninvalid`);
    expect(result.nodes).toHaveLength(1); expect(result.skipped).toBe(2);
    expect(result.nodes[0]).toMatchObject({ country: 'Unknown', ping: 0, source: 'FastNodes', name: 'VLESS · 1' });
  });
  it('uses source-reported country feeds and base64', () => {
    expect(parseDirectory(btoa(uri), 'SG').nodes[0]?.country).toBe('Singapore');
  });
  it('rejects oversized feeds', () => { expect(() => parseDirectory('x'.repeat(2_000_001))).toThrow('size'); });
  it('sorts measurements before unknown values without mutating input', () => {
    const node = parseDirectory(uri).nodes[0]; if (!node) throw new Error('Missing fixture');
    const nodes = [{ ...node, id: 'node-a', name: 'A', country: 'Japan', ping: 0 }, { ...node, id: 'node-b', name: 'B', country: 'Germany', ping: 20 }];
    expect(sortDirectory(nodes, 'latency', {}).map(n => n.id)).toEqual(['node-b', 'node-a']);
    expect(sortDirectory(nodes, 'location', {}).map(n => n.id)).toEqual(['node-b', 'node-a']);
    expect(sortDirectory(nodes, 'rating', { 'node-a': 5 }).map(n => n.id)).toEqual(['node-a', 'node-b']);
    expect(nodes[0]?.id).toBe('node-a');
  });
  it('validates saved personal ratings', () => {
    expect(readRatings('{"node-a":5,"node-b":6,"bad":2,"node-c":"3"}')).toEqual({ 'node-a': 5 });
    expect(readRatings('broken')).toEqual({}); expect(readRatings('[]')).toEqual({});
  });
});
describe('Native boundary', () => {
  it('fails unavailable without simulation fallback', async () => { await expect(unavailableNativeVpn.connect()).rejects.toThrow('No device traffic'); await expect(unavailableNativeVpn.probe()).rejects.toThrow('requires'); });
  it('passes DNS and routing to the native VPN configuration', () => {
    const node = parseDirectory(uri).nodes[0]; if (!node) throw new Error('Missing fixture');
    const request = nativeConnectRequest(node, { ...defaultSettings, dns: '9.9.9.9', routing: 'Bypass Mainland/Domestic' });
    expect(request.config.dns.servers).toEqual(['9.9.9.9']);
    expect(request.config.routing.rules).toContainEqual({ type: 'field', ip: ['geoip:cn'], outboundTag: 'direct' });
  });
  it('rejects stale sessions, disconnected updates and invalid counters', () => {
    const event = { sessionId: 'new', elapsedSeconds: 1, receivedBytes: 100, sentBytes: 10, downloadBytesPerSecond: 100, uploadBytesPerSecond: 10, latencyMs: null };
    expect(acceptNativeTraffic(event, 'new', true)).toBe(true);
    expect(acceptNativeTraffic(event, 'old', true)).toBe(false);
    expect(acceptNativeTraffic(event, 'new', false)).toBe(false);
    expect(acceptNativeTraffic({ ...event, receivedBytes: -1 }, 'new', true)).toBe(false);
    expect(acceptNativeTraffic({ ...event, sessionId: '' }, '', true)).toBe(false);
  });
});