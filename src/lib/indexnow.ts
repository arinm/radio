/**
 * IndexNow protocol client — notifies search engines (Bing, Yandex, Seznam, Naver)
 * when URLs are added, updated or deleted.
 * @see https://www.indexnow.org/
 */
import { SITE_URL } from './constants';

export const INDEXNOW_KEY = '556f0aae895c4ef6dc690ea45dbeb208';

const ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function submitToIndexNow(urls: string[]): Promise<{ ok: boolean; status: number; body?: string }> {
  if (urls.length === 0) return { ok: true, status: 200 };

  const host = new URL(SITE_URL).hostname;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    return { ok: res.ok, status: res.status, body: await res.text().catch(() => undefined) };
  } catch (e) {
    return { ok: false, status: 0, body: e instanceof Error ? e.message : 'unknown error' };
  }
}
