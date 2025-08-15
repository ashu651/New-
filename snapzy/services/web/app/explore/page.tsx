"use client"
import { useEffect, useState } from 'react'

type User = { id: string; handle: string; name?: string | null }

export default function ExplorePage() {
	const [users, setUsers] = useState<User[]>([])
	useEffect(() => {
		const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/graphql'
		fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ usersList { id handle name } }' }) })
			.then(r => r.json()).then(j => setUsers(j.data?.usersList || []))
			.catch(() => setUsers([]))
	}, [])
	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold">Explore creators</h2>
			<ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				{users.map(u => (
					<li key={u.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
						<div className="font-semibold">@{u.handle}</div>
						<div className="text-sm text-gray-600 dark:text-gray-300">{u.name || '—'}</div>
					</li>
				))}
			</ul>
		</div>
	)
}