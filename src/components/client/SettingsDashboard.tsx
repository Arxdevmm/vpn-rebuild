import { useState } from 'react';
import { BookOpen, Building2, ChevronDown, CircleHelp, ExternalLink, Info, Mail, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from './LanguageProvider';
import { appFaqs, appGuides } from '@/lib/app-help';

export function SettingsDashboard({ onWelcome }: { onWelcome: () => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const sections = [
    { id: 'appearance', title: 'APPEARANCE', icon: Palette },
    { id: 'about', title: 'About Netcon', icon: Info },
    { id: 'studio', title: 'Developer & studio', icon: Building2 },
    { id: 'contact', title: 'Contact', icon: Mail },
    { id: 'guides', title: 'How-to guides', icon: BookOpen },
    { id: 'faq', title: 'FAQs', icon: CircleHelp },
  ];
  return <Collapsible open={open} onOpenChange={setOpen} className="settings-dashboard">
    <CollapsibleTrigger asChild><Button variant="ghost" className="dashboard-toggle" aria-label={t('App settings')}><Settings size={16} /><span>{t('SETTINGS')}</span><ChevronDown size={16} className={open ? 'dashboard-chevron open' : 'dashboard-chevron'} /></Button></CollapsibleTrigger>
    <CollapsibleContent>
      <Accordion type="single" collapsible className="dashboard-sections">
        {sections.map(section => <AccordionItem key={section.id} value={section.id} className="dashboard-section">
          <AccordionTrigger className="dashboard-section-trigger"><span><section.icon size={17} />{t(section.title)}</span></AccordionTrigger>
          <AccordionContent className="dashboard-section-content">
            {section.id === 'appearance' && <div className="dashboard-appearance"><div><strong>{t('Brushed Steel & Burnished Copper')}</strong><small>{t('PRECISION INSTRUMENT / DARK')}</small></div><div className="swatches"><span className="swatch swatch-steel" title="Steel" /><span className="swatch swatch-highlight" title="Silver" /><span className="swatch swatch-copper" title="Copper" /><span className="swatch swatch-glow" title="Copper highlight" /></div></div>}
            {section.id === 'about' && <><h3>Netcon</h3><p>{t('A connection configuration client for Myanmar, with local imports, public server browsing and Gemini recommendations.')}</p><dl className="dashboard-facts"><div><dt>{t('App version')}</dt><dd>2.4.1</dd></div><div><dt>{t('Client mode')}</dt><dd>{t('Native Android VPN')}</dd></div><div><dt>{t('Supported protocols')}</dt><dd>VLESS · VMESS · TROJAN · SS</dd></div></dl><p>{t(appFaqs[0]?.answer ?? '')}</p><Button variant="outline" className="keycap dashboard-welcome" onClick={onWelcome}><Info size={16} />{t('WELCOME SCREENS')}</Button></>}
            {section.id === 'studio' && <><h3>Artesys Digital Solutions</h3><p>{t('Development studio')}</p><p>{t('Software engineering, product design and digital marketing.')}</p><Button asChild variant="link" className="dashboard-link"><a href="https://artesysdigitalsolution.com/about" target="_blank" rel="noopener noreferrer">artesysdigitalsolution.com<ExternalLink size={14} /></a></Button></>}
            {section.id === 'contact' && <><p>{t('Contact Artesys through the consultation form on its official website.')}</p><Button asChild variant="outline" className="keycap dashboard-contact"><a href="https://artesysdigitalsolution.com/contact" target="_blank" rel="noopener noreferrer">{t('Contact Artesys')}<ExternalLink size={14} /></a></Button><p className="dashboard-caution">{t('Never send server passwords, configuration links or API keys in a support request.')}</p></>}
            {section.id === 'guides' && <div className="dashboard-guides">{appGuides.map(guide => <article key={guide.title}><h3>{t(guide.title)}</h3><ol>{guide.steps.map(step => <li key={step}>{t(step)}</li>)}</ol></article>)}</div>}
            {section.id === 'faq' && <Accordion type="single" collapsible className="dashboard-faqs">{appFaqs.map(faq => <AccordionItem key={faq.question} value={faq.question}><AccordionTrigger className="dashboard-faq-trigger">{t(faq.question)}</AccordionTrigger><AccordionContent><p>{t(faq.answer)}</p></AccordionContent></AccordionItem>)}</Accordion>}
          </AccordionContent>
        </AccordionItem>)}
      </Accordion>
    </CollapsibleContent>
  </Collapsible>;
}