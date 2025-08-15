#!/usr/bin/env node
import fetch from 'node-fetch';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function main() {
	const users = [
		{ handle: 'alice', email: 'alice@example.com', password: 'password', name: 'Alice' },
		{ handle: 'bob', email: 'bob@example.com', password: 'password', name: 'Bob' },
	];
	for (const u of users) {
		try {
			const res = await fetch(`${API}/graphql`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: `mutation($h:String!,$e:String,$p:String!,$n:String){ createUser(handle:$h,email:$e,password:$p,name:$n){ id handle } }`, variables: { h: u.handle, e: u.email, p: u.password, n: u.name } })
			});
			const json = await res.json();
			console.log('seeded user', json.data.createUser);
		} catch (e) {
			console.error('seed error', e);
		}
	}
}

main();