import privacy from '@/assets/welcome-privacy.jpg';
import intelligence from '@/assets/welcome-intelligence.jpg';
import entertainment from '@/assets/welcome-entertainment.jpg';
import directory from '@/assets/welcome-directory.jpg';
import control from '@/assets/welcome-control.jpg';
export const welcomeStorageKey = 'netcon-welcome-seen-v1';
export const welcomeSlides = [
  { image: privacy, label: '01 / YOUR PRIVACY', title: 'Your credentials.\nYour control.', description: 'Import links and QR codes locally. Server credentials stay out of AI requests.', alt: 'Silver and copper shield with a precision keyhole' },
  { image: intelligence, label: '02 / INTELLIGENT CHOICES', title: 'A connection\nwith purpose.', description: 'Tell Gemini what matters to you and get a recommendation from your imported servers.', alt: 'Copper processor connected to five silver network terminals' },
  { image: entertainment, label: '03 / PLAY & STREAM', title: 'Made for your\nonline world.', description: 'Explore server recommendations for gaming, streaming and everyday communication.', alt: 'Brushed silver game controller beside a copper play symbol' },
  { image: directory, label: '04 / DISCOVER SERVERS', title: 'Explore beyond\nborders.', description: 'Browse public country feeds and save your own ratings. Public servers are untrusted; latency is unmeasured.', alt: 'Engraved silver globe with copper meridian and network cables' },
  { image: control, label: '05 / PRECISION CONTROL', title: 'Every detail.\nIn your hands.', description: 'Set DNS and routing preferences, then connect through the native Android VPN service. Browser-only use cannot route device traffic.', alt: 'Silver analog gauges and mechanical drum counter on a steel instrument panel' },
];