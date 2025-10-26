import { API_BASE_URL } from './config';

// If API_BASE_URL is empty (e.g., GitHub Pages static hosting),
// use localStorage as a no-backend fallback to avoid runtime errors.
const useLocalFallback = !API_BASE_URL;

export async function loadDocument(key: string) {
    if (useLocalFallback) {
        const raw = localStorage.getItem(`doc:${key}`);
        const content = raw ? JSON.parse(raw) : null;
        return { key, content } as any;
    }
    const res = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error('Failed to load');
    return res.json();
}

export async function saveDocument(key: string, content: unknown) {
    if (useLocalFallback) {
        localStorage.setItem(`doc:${key}`, JSON.stringify(content));
        return;
    }
    await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(key)}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
}
