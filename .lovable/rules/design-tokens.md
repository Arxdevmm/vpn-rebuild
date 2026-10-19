# Design Tokens

Token reference for **Netcon**. Use utility classes and CSS variables — never raw values.

## Colors

Apply with any color utility: `bg-<name>`, `text-<name>`, `border-<name>`, `ring-<name>`, `divide-<name>`, etc.

| Name | CSS variable |
|---|---|
| `background` | `--background` |
| `foreground` | `--foreground` |
| `steel` | `--steel` |
| `card` | `--card` |
| `bevel` | `--bevel` |
| `deep-ink` | `--deep-ink` |
| `primary` | `--primary` |
| `primary-foreground` | `--primary-foreground` |
| `copper-highlight` | `--copper-highlight` |
| `copper-bevel` | `--copper-bevel` |
| `copper-glow` | `--copper-glow` |
| `secondary` | `--secondary` |
| `muted` | `--muted` |
| `muted-foreground` | `--muted-foreground` |
| `accent` | `--accent` |
| `border` | `--border` |
| `input` | `--input` |
| `destructive` | `--destructive` |
| `online` | `--online` |
| `offline-border` | `--offline-border` |
| `plate-light` | `--plate-light` |
| `plate-mid` | `--plate-mid` |
| `plate-shade` | `--plate-shade` |
| `engrave-ink` | `--engrave-ink` |
| `engrave-light` | `--engrave-light` |
| `engrave-copper` | `--engrave-copper` |
| `dial-label` | `--dial-label` |
| `brand-facebook` | `--brand-facebook` |
| `brand-instagram` | `--brand-instagram` |
| `brand-youtube` | `--brand-youtube` |
| `brand-pubg` | `--brand-pubg` |

## Typography

Typography classes (`font-*` for families, `text-*` for sizes):

| Class | CSS variable |
|---|---|
| `font-sans` | `--font-sans` |
| `font-display` | `--font-display` |
| `font-mono` | `--font-mono` |

## Border Radius

Border-radius classes:

| Class | CSS variable |
|---|---|
| `rounded-sm` | `--radius-sm` |
| `rounded-md` | `--radius-md` |
| `rounded-lg` | `--radius-lg` |
| `rounded-xl` | `--radius-xl` |

## Shadows

Box-shadow classes:

| Class | CSS variable |
|---|---|
| `shadow` | `--shadow` |
| — | `--tray-shadow` |
| — | `--key-shadow` |
| — | `--incised-shadow` |

## Other

Reference via `var(--name)` in inline styles or CSS.

| CSS variable |
|---|
| `--brush-grain` |
| `--copper-gradient` |
| `--title-relief` |
| `--panel-relief` |
| `--welcome-shade` |

