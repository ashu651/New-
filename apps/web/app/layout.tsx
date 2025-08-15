import './globals.css';
import type { ReactNode } from 'react';
import ClientNav from '../components/ClientNav';

export const metadata = {
  title: 'Snapzy',
  description: 'Create. Connect. Thrive.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientNav />
        {children}
      </body>
    </html>
  );
}