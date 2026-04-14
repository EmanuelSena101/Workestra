// ─── Workestra Design Tokens ───
// Corporate visual language for the Workestra platform

export const colors = {
  shell: {
    bg: '#f0f0f0',
  },
  sidebar: {
    primary: '#0080d0',
    secondary: '#60a0c0',
    activeBg: 'rgba(255, 255, 255, 0.15)',
    hoverBg: 'rgba(255, 255, 255, 0.10)',
  },
  text: {
    primary: '#505050',
    muted: '#808080',
    inverse: '#ffffff',
    link: '#0080d0',
  },
  border: {
    soft: '#d0d0d0',
    focus: '#0080d0',
  },
  surface: {
    default: '#ffffff',
    alt: '#f7f8fa',
    hover: '#f0f2f5',
  },
  status: {
    success: '#28a745',
    warning: '#e0b020',
    danger: '#b00000',
    info: '#0080d0',
  },
  badge: {
    pending: '#e0b020',
    active: '#0080d0',
    completed: '#28a745',
    overdue: '#b00000',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const layout = {
  sidebar: {
    width: '112px',
    collapsedWidth: '56px',
  },
  topbar: {
    height: '56px',
  },
  content: {
    maxWidth: '1440px',
    padding: '24px',
  },
} as const;

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 4px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.10)',
  card: '0 1px 3px rgba(0, 0, 0, 0.06)',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
} as const;
