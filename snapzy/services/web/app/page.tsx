"use client"
import { motion } from 'framer-motion'

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-6">
			<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-6xl font-extrabold text-center">
				Snapzy
			</motion.h1>
			<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-center text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
				Create. Remix. Connect. A next-gen social platform with AI co-creation, realtime collabs, and creator-first tools.
			</motion.p>
			<motion.a href="/explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 inline-flex items-center rounded-xl bg-brand-600 px-6 py-3 text-white shadow-soft hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600">
				Explore
			</motion.a>
		</div>
	)
}