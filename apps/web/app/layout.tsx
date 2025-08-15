import './globals.css';
import type { ReactNode } from 'react';
import { tokens } from '@snapzy/design-system';

export const metadata = {
  title: 'Snapzy',
  description: 'Create. Connect. Thrive.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: tokens.colors.bgLight, color: tokens.colors.textDark }}>
        {children}
      </body>
    </html>
  );
}