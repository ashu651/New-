import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-white text-black dark:bg-black dark:text-white">
				<a href="#content" className="sr-only focus:not-sr-only">Skip to content</a>
				<main id="content" className="min-h-screen">{children}</main>
			</body>
		</html>
	)
}