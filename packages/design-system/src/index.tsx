export const tokens = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#5B21B6',
    bg: '#0B0B0F',
    bgLight: '#FFFFFF',
    text: '#F5F6F8',
    textDark: '#111827',
    muted: '#9CA3AF'
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
    ghost: { background: 'transparent', color: tokens.colors.textDark, border: '1px solid #E5E7EB' }
  };

  return <button style={{ ...base, ...variants[variant], ...style }} {...rest} />;
}