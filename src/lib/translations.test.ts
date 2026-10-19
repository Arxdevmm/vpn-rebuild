import { describe, expect, it } from 'vitest';
import { translate } from './translations';
import { appGuides, appFaqs } from './app-help';
describe('Netcon languages', () => {
  it('keeps English labels unchanged', () => { expect(translate('en', 'SETTINGS')).toBe('SETTINGS'); });
  it('translates Myanmar labels', () => { expect(translate('my', 'SETTINGS')).toBe('ဆက်တင်များ'); });
  it('preserves brands and configuration values', () => {
    for (const label of ['Netcon', 'YouTube 4K', 'Facebook & IG', 'PUBG Mobile', 'Instagram', 'VLESS', '1.1.1.1']) expect(translate('my', label)).toBe(label);
  });
  it('preserves Gemini spelling inside translations', () => { expect(translate('my', 'Ask Gemini')).toContain('Gemini'); });
  it('translates all dashboard guides and FAQs', () => {
    for (const text of [...appGuides.flatMap(guide => [guide.title, ...guide.steps]), ...appFaqs.flatMap(faq => [faq.question, faq.answer])]) expect(translate('my', text)).not.toBe(text);
    expect(translate('my', appGuides[1]?.steps[0] ?? '')).toContain('YouTube');
    expect(translate('my', 'CONFIG')).toBe('CONFIG');
  });
});