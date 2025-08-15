export { ThemeProvider, useTheme } from './theme';

export const tokens = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#5B21B6',
    bg: '#0B0B0F',
    bgLight: '#FFFFFF',
    text: '#111827',
    textOnDark: '#F9FAFB',
    muted: '#6B7280',
    border: '#E5E7EB'
  },
  radii: { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 10px 24px rgba(0,0,0,0.2)'
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    size: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, '2xl': 32 },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  }
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', style, ...rest }: ButtonProps) {
  const base = {
    borderRadius: tokens.radii.pill,
    padding: size === 'sm' ? '6px 10px' : size === 'lg' ? '12px 18px' : '10px 14px',
    fontWeight: tokens.typography.weight.semibold,
    cursor: 'pointer',
    border: 'none'
  } as const;

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: tokens.colors.primary, color: 'white' },
    ghost: { background: 'transparent', color: tokens.colors.text, border: `1px solid ${tokens.colors.border}` }
  };

  return <button style={{ ...base, ...variants[variant], ...style }} {...rest} />;
}

export function Card({ style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const base: React.CSSProperties = { borderRadius: tokens.radii.lg, boxShadow: tokens.shadow.md, border: `1px solid ${tokens.colors.border}`, padding: 16, background: 'white' };
  return <div style={{ ...base, ...style }} {...rest} />;
}

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const style: React.CSSProperties = { borderRadius: tokens.radii.md, border: `1px solid ${tokens.colors.border}`, padding: '10px 12px', width: '100%' };
  return <input {...props} style={{ ...style, ...(props.style || {}) }} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span>{label}</span>
      <input type="checkbox" role="switch" aria-checked={checked} checked={checked} onChange={(e)=>onChange(e.target.checked)} />
    </label>
  );
}

export function Navbar({ onToggleTheme }: { onToggleTheme: () => void }) {
  const navStyle: React.CSSProperties = { display: 'flex', gap: 12, padding: 12, borderBottom: `1px solid ${tokens.colors.border}`, alignItems: 'center', justifyContent: 'space-between' };
  return (
    <div style={navStyle}>
      <div style={{ display: 'flex', gap: 12 }}>
        <a href="/">Home</a>
        <a href="/feed">Feed</a>
        <a href="/compose">Compose</a>
        <a href="/inbox">Inbox</a>
        <a href="/settings/explore">Explore</a>
      </div>
      <Button variant="ghost" onClick={onToggleTheme}>Theme</Button>
    </div>
  );
}