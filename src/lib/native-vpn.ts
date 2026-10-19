import { Capacitor, registerPlugin } from '@capacitor/core';
import { makeConfig, type ClientSettings, type ServerNode } from './v2ray';

export type NativeVpnState = 'connecting' | 'connected' | 'disconnected' | 'error';
export type NativeVpnStatus = {
  state: NativeVpnState;
  error: string;
  sessionId: string;
  elapsedSeconds: number;
  receivedBytes: number;
  sentBytes: number;
  downloadBytesPerSecond: number;
  uploadBytesPerSecond: number;
  latencyMs: number | null;
};
export type NativeTraffic = Pick<NativeVpnStatus, 'sessionId' | 'elapsedSeconds' | 'receivedBytes' | 'sentBytes' | 'downloadBytesPerSecond' | 'uploadBytesPerSecond' | 'latencyMs'>;
type NativeVpnPlugin = {
  connect(options: { config: string }): Promise<{ state: 'connecting' }>;
  disconnect(): Promise<void>;
  getStatus(): Promise<NativeVpnStatus>;
  openVpnSettings(): Promise<void>;
};

const nativeVpnPlugin = registerPlugin<NativeVpnPlugin>('NativeVpn');

export function isNativeVpnAvailable(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function connectNativeVpn(node: ServerNode, settings: ClientSettings): Promise<void> {
  if (!isNativeVpnAvailable()) {
    throw new Error('A real VPN connection is available only in the Android app.');
  }
  const request = nativeConnectRequest(node, settings);
  await nativeVpnPlugin.connect({ config: JSON.stringify(request.config) });
}

export async function disconnectNativeVpn(): Promise<void> {
  if (!isNativeVpnAvailable()) {
    throw new Error('A real VPN connection is available only in the Android app.');
  }
  await nativeVpnPlugin.disconnect();
}

export async function getNativeVpnStatus(): Promise<NativeVpnStatus> {
  if (!isNativeVpnAvailable()) {
    throw new Error('A real VPN connection is available only in the Android app.');
  }
  return nativeVpnPlugin.getStatus();
}

export async function openNativeVpnSettings(): Promise<void> {
  if (!isNativeVpnAvailable()) {
    throw new Error('Android VPN settings are available only in the Android app.');
  }
  await nativeVpnPlugin.openVpnSettings();
}

export function nativeConnectRequest(node: ServerNode, settings: ClientSettings) {
  return { config: makeConfig(node, settings) };
}
export const unavailableNativeVpn = {
  available: false as const,
  async connect(): Promise<never> { throw new Error('A real VPN connection is available only in the Android app. No device traffic is protected.'); },
  async probe(): Promise<never> { throw new Error('Latency measurement requires the native Android VPN service.'); },
};
export function acceptNativeTraffic(event: NativeTraffic, currentSessionId: string | null, connected: boolean): boolean {
  return connected && !!event.sessionId && currentSessionId === event.sessionId && [event.elapsedSeconds, event.receivedBytes, event.sentBytes, event.downloadBytesPerSecond, event.uploadBytesPerSecond].every(n => Number.isFinite(n) && n >= 0) && (event.latencyMs === null || Number.isFinite(event.latencyMs) && event.latencyMs >= 0);
}