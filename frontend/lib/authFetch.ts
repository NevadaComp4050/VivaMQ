import { getSession } from 'next-auth/react';

export async function authFetch(url: string, options: RequestInit = {}) {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  return fetch(url, {
    ...options,
    headers,
  });
}