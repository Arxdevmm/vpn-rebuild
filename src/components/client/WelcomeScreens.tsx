import { useLanguage } from '@/components/client/LanguageProvider';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { welcomeSlides } from '@/lib/welcome';
import { BrandCard } from './BrandCard';
export function WelcomeScreens({ open, onFinish }: { open: boolean; onFinish: () => void }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const slide = welcomeSlides[index];
  if (!slide) return null;
  return <Dialog open={open} onOpenChange={v => { if (!v) onFinish(); }}><DialogContent className="welcome-screen" onKeyDown={e => {
    if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, 4));
    if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
  }}>
    <img key={slide.image} className="welcome-art" src={slide.image} alt={slide.alt} width={1024} height={1792} fetchPriority="high" /><div className="welcome-shade" />
    <header className="welcome-header"><BrandCard compact /><Button variant="ghost" className="welcome-skip" onClick={onFinish}>{t("Skip")}</Button></header>
    <div className="welcome-copy" aria-live="polite"><span className="welcome-label">{t(slide.label)}</span><DialogTitle className="welcome-title">{t(slide.title)}</DialogTitle><DialogDescription className="welcome-description">{t(slide.description)}</DialogDescription></div>
    <footer className="welcome-footer"><div className="welcome-navigation"><Button variant="ghost" size="icon" className="welcome-back" disabled={index === 0} aria-label={t("Previous welcome screen")} onClick={() => setIndex(i => Math.max(i - 1, 0))}><ArrowLeft /></Button><div className="welcome-dots" aria-label={t("Welcome screens")}>{welcomeSlides.map((s, i) => <Button key={s.label} variant="ghost" size="icon" className={`welcome-dot ${i === index ? 'selected' : ''}`} aria-label={`Welcome screen ${i + 1}`} aria-current={i === index ? 'step' : undefined} onClick={() => setIndex(i)}><span /></Button>)}</div><span className="welcome-count">{index + 1} / 5</span></div><Button className="copper-button welcome-next" onClick={() => { if (index === 4) onFinish(); else setIndex(i => i + 1); }}>{index === 4 ? t('OPEN AIV2Ray') : t('CONTINUE')}{index === 4 ? <Check /> : <ArrowRight />}</Button><span className="welcome-edition">{t("ANDROID APP · REAL VPN CONTROLS")}</span></footer>
  </DialogContent></Dialog>;
}