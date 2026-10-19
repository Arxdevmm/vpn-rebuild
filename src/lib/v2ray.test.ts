import { describe, it, expect } from 'vitest';
import { parseUri, parseSubscription, makeConfig } from './v2ray';
const uuid = 'a1b2c3d4-1111-4111-8111-123456789abc';
describe('Local V2Ray parser', () => {
  it('parses VLESS Reality, IPv6 and grpc', () => { const n = parseUri(`vless://${uuid}@[2001:db8::1]:443?security=reality&pbk=test&sni=example.com&sid=abcd&type=grpc&serviceName=tunnel&flow=xtls-rprx-vision#Test`); expect(n.address).toBe('2001:db8::1'); expect(makeConfig(n).outbounds[0].streamSettings?.['realitySettings']).toMatchObject({ publicKey: 'test', shortId: 'abcd' }); });
  it('decodes unpadded VMess JSON', () => { const n = parseUri('vmess://' + btoa(JSON.stringify({ add: 'example.com', port: '443', id: uuid, net: 'ws', path: '/vpn', tls: 'tls', ps: 'Tokyo' })).replace(/=+$/, '')); expect(n.name).toBe('Tokyo'); expect(makeConfig(n).outbounds[0].streamSettings?.['wsSettings']).toMatchObject({ path: '/vpn' }); });
  it('decodes Trojan password', () => { const n = parseUri('trojan://a%3Ab%40c@example.com:443#Trojan'); expect(n.credential).toBe('a:b@c'); expect(n.security).toBe('tls'); });
  it('supports SIP002 and legacy Shadowsocks', () => { for (const uri of ['ss://' + btoa('aes-256-gcm:password') + '@example.com:8388#SS', 'ss://' + btoa('aes-256-gcm:password@example.com:8388')]) expect(parseUri(uri)).toMatchObject({ protocol: 'shadowsocks', credential: 'password', port: 8388 }); });
  it('parses base64 subscriptions', () => { expect(parseSubscription(btoa(`vless://${uuid}@example.com:443\ntrojan://secret@example.com:443`))).toHaveLength(2); });
  it('rejects bad input and unsupported plugins', () => { expect(() => parseUri('hello')).toThrow(); expect(() => parseUri('vless://bad@example.com:443')).toThrow('UUID'); expect(() => parseUri('ss://' + btoa('aes-256-gcm:password') + '@example.com:8388?plugin=obfs')).toThrow('plugins'); });
  it('exports loopback-only proxies and no logging', () => { const config = makeConfig(parseUri(`vless://${uuid}@example.com:443`)); expect(config.log.loglevel).toBe('none'); expect(config.inbounds.map(i => i.listen)).toEqual(['127.0.0.1', '127.0.0.1']); });
});