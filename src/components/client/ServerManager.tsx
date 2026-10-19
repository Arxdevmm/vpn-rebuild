import { useLanguage } from '@/components/client/LanguageProvider';
import { useEffect, useRef, useState } from 'react';
import { Check, Plus, Link2, ScanLine, FileUp, Globe2, Radio, Trash2 } from 'lucide-react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { createManualNode, parseUri, parseSubscription, type ServerNode, type Protocol } from '@/lib/v2ray';
import { PublicDirectory } from './PublicDirectory';

export function ServerManager({ open, onOpenChange, nodes, selected, onSelect, onAdd, onDelete, protocols }: { open: boolean; onOpenChange: (v: boolean) => void; nodes: ServerNode[]; selected: string; onSelect: (node: ServerNode) => void; onAdd: (nodes: ServerNode[]) => void; onDelete: (id: string) => void; protocols: Protocol[] }) {
  const { t } = useLanguage();
  const [view, setView] = useState<'directory' | 'saved'>('directory');
  const [mode, setMode] = useState<'list' | 'uri' | 'manual' | 'subscription' | 'qr'>('list');
  const [text, setText] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState({ name: '', address: '', port: '443', credential: '', protocol: 'vless' as Protocol, network: 'tcp', security: 'tls' });
  const [camera, setCamera] = useState(false); const video = useRef<HTMLVideoElement>(null); const stream = useRef<MediaStream | null>(null); const upload = useRef<HTMLInputElement>(null);
  function stopCamera() { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamera(false); }
  useEffect(() => { if (!open || mode !== 'qr') { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamera(false); } }, [open, mode]);
  useEffect(() => () => { stream.current?.getTracks().forEach(t => t.stop()); }, []);
  function finish(items: ServerNode[]) { onAdd(items); setMode('list'); setText(''); setError(''); stopCamera(); }
  async function importConfig() {
    setError(''); setBusy(true);
    try {
      if (mode === 'manual') finish([createManualNode({ ...manual, port: Number(manual.port), name: manual.name || `${manual.protocol.toUpperCase()} server`, params: {} })]);
      else if (mode === 'subscription') {
        if (/^https:\/\//.test(text.trim())) {
          const response = await fetch(text.trim(), { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(15000) });
          if (!response.ok) throw new Error(`Subscription returned ${response.status}.`);
          finish(parseSubscription(await response.text()));
        } else finish(parseSubscription(text));
      } else finish([parseUri(text)]);
    } catch (e) { setError(e instanceof Error ? e.message : t('Import failed.')); } finally { setBusy(false); }
  }
  async function readQr(file: File) {
    setError('');
    try {
      const bitmap = await createImageBitmap(file); const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Image reader unavailable.'); ctx.drawImage(bitmap, 0, 0); bitmap.close();
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height); const code = jsQR(data.data, data.width, data.height);
      if (!code) throw new Error('No QR code found in this image.'); finish([parseUri(code.data)]);
    } catch (e) { setError(e instanceof Error ? e.message : t('Unable to read QR.')); }
  }
  async function startCamera() {
    setError('');
    try { stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); setCamera(true); }
    catch { setError('Camera access unavailable. Allow camera permission or upload an image.'); }
  }
  useEffect(() => {
    if (!camera || !video.current || !stream.current) return;
    video.current.srcObject = stream.current; void video.current.play();
    const timer = setInterval(() => {
      const v = video.current; if (!v || !v.videoWidth) return;
      const canvas = document.createElement('canvas'); canvas.width = v.videoWidth; canvas.height = v.videoHeight;
      const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.drawImage(v, 0, 0); const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(image.data, image.width, image.height); if (code) { try { finish([parseUri(code.data)]); } catch (e) { setError(e instanceof Error ? e.message : t('Invalid QR.')); stopCamera(); } }
    }, 350);
    return () => clearInterval(timer);
  }, [camera]);
  function changeMode(value: typeof mode) { setMode(value); setError(''); setText(''); }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="server-dialog"><DialogTitle className="text-primary flex items-center gap-3"><Radio size={20} />{t("SERVER MANAGEMENT")}</DialogTitle><DialogDescription>{nodes.length} {t('nodes available · Configuration is parsed locally')}</DialogDescription>
    {mode === 'list' ? <><div className="import-options"><Button variant="outline" className="keycap" aria-pressed={view === 'directory'} onClick={() => setView('directory')}><Globe2 />{t("Public directory")}</Button><Button variant="outline" className="keycap" aria-pressed={view === 'saved'} onClick={() => setView('saved')}><Radio />{t('My servers')} ({nodes.length})</Button></div>{view === 'directory' ? <PublicDirectory protocols={protocols} onImport={item => onAdd([item])} /> : <div className="server-list">{!nodes.length && <p className="directory-meta">{t("No servers imported.")}</p>}{nodes.map(node => <div className="server-list-row" key={node.id}><Button variant="ghost" className={`node-choice ${selected === node.id ? 'selected' : ''}`} onClick={() => { onSelect(node); onOpenChange(false); }}><span className="node-flag">{node.flag}</span><span className="node-details"><strong>{node.name}</strong><small>{node.protocol.toUpperCase()} · {node.source ? t('UNTRUSTED PUBLIC') : node.address}</small></span><span className="latency-tag">{node.ping ? `${node.ping} ms` : t('Unmeasured')}</span>{selected === node.id && <Check size={16} />}</Button><Button variant="ghost" size="icon" title={t("Delete server")} aria-label={`Delete ${node.name}`} onClick={() => onDelete(node.id)}><Trash2 /></Button></div>)}</div>}<div className="section-heading mt-2"><span>{t("ADD A SERVER")}</span><Plus size={15} /></div><div className="import-options">{([{ key: 'uri', icon: Link2, name: 'Paste URI' }, { key: 'manual', icon: Plus, name: 'Manual config' }, { key: 'subscription', icon: Globe2, name: 'Subscription' }, { key: 'qr', icon: ScanLine, name: 'Scan QR code' }] as const).map(item => <Button variant="outline" className="keycap" key={item.key} onClick={() => changeMode(item.key)}><item.icon />{t(item.name)}</Button>)}</div></> : <>
    <Button variant="ghost" className="justify-start text-muted-foreground" onClick={() => changeMode('list')}>{t("← Back to servers")}</Button>
    {mode === 'manual' ? <div className="manual-fields">{(['name', 'address', 'port', 'credential'] as const).map(field => <label key={field} className="field-label">{field === 'credential' ? t('UUID / PASSWORD') : t(field.toUpperCase())}<input className="engraved-input" type={field === 'credential' ? 'password' : 'text'} value={manual[field]} onChange={e => setManual({ ...manual, [field]: e.target.value })} /></label>)}<label className="field-label">{t("PROTOCOL")}<select className="engraved-input" value={manual.protocol} onChange={e => setManual({ ...manual, protocol: e.target.value as Protocol })}><option value="vless">VLESS</option><option value="vmess">VMESS</option><option value="trojan">Trojan</option></select></label><label className="field-label">{t("TRANSPORT")}<select className="engraved-input" value={manual.network} onChange={e => setManual({ ...manual, network: e.target.value })}><option value="tcp">TCP</option><option value="ws">WebSocket</option><option value="grpc">gRPC</option></select></label><label className="field-label">{t("SECURITY")}<select className="engraved-input" value={manual.security} onChange={e => setManual({ ...manual, security: e.target.value })}><option value="tls">TLS</option><option value="none">{t("None")}</option></select></label></div> : mode === 'qr' ? <div className="qr-panel">{camera && <video ref={video} playsInline muted className="camera-preview" />}<ScanLine className="text-primary mx-auto" size={42} /><div className="flex gap-3 justify-center"><Button variant="outline" onClick={camera ? stopCamera : startCamera}>{camera ? t('Stop camera') : t('Open camera')}</Button><Button variant="outline" onClick={() => upload.current?.click()}><FileUp />{t("Upload image")}</Button><input ref={upload} type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) void readQr(file); }} /></div></div> : <label className="field-label">{mode === 'subscription' ? t('HTTPS URL OR SUBSCRIPTION CONTENT') : t('CONFIGURATION LINK')}<textarea className="engraved-input min-h-32" value={text} onChange={e => setText(e.target.value)} placeholder={mode === 'subscription' ? t('https://… or paste subscription content') : 'vmess://, vless://, trojan://, ss://'} />{mode === 'subscription' && <small className="text-muted-foreground">{t("URL imports require the provider to allow browser access. Otherwise paste the subscription content.")}</small>}</label>}
    {error && <p role="alert" className="text-destructive text-sm">{t(error)}</p>}{mode !== 'qr' && <Button className="copper-button" onClick={importConfig} disabled={busy || (mode !== 'manual' && !text.trim())}><Plus />{busy ? t('IMPORTING…') : t('ADD SERVER')}</Button>}</>}
  </DialogContent></Dialog>;
}