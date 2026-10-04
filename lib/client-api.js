export async function apiRequest(url, options) {
    const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
    const data = await response.json().catch(() => ({ error: 'Invalid server response' }));
    if (!response.ok)
        throw Object.assign(new Error(data.error || `Request failed (${response.status})`), { status: response.status });
    return data;
}
