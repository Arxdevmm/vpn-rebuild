import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { languageStorageKey, translate, type Language } from '@/lib/translations';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (text: string) => string }>({ language: 'en', setLanguage: () => {}, t: text => text });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => { try { if (localStorage.getItem(languageStorageKey) === 'my') setLanguage('my'); } catch { /* Keep English when storage is unavailable. */ } }, []);
  useEffect(() => { document.documentElement.lang = language; document.body.classList.toggle('language-my', language === 'my'); }, [language]);
  function changeLanguage(value: Language) { setLanguage(value); try { localStorage.setItem(languageStorageKey, value); } catch { /* The choice remains active for this session. */ } }
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: text => translate(language, text) }}><div className={`localized-client language-${language}`} lang={language}>{children}</div></LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return <div className="language-selection"><span id="language-label">{t('Language')}</span><div className="language-pill" role="group" aria-labelledby="language-label">{([{ value: 'en', label: 'English' }, { value: 'my', label: 'မြန်မာ' }] as const).map(item => <Button key={item.value} variant="ghost" className={`language-option ${language === item.value ? 'selected' : ''}`} lang={item.value} aria-pressed={language === item.value} onClick={() => setLanguage(item.value)}><span className="language-radio" aria-hidden="true" />{item.label}</Button>)}</div></div>;
}
