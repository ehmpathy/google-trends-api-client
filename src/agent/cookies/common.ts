export interface CookiesCache {
  set: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string | undefined>;
}

export const COOKIES_CACHE_COOKIES_LIST_KEY =
  'google-trends-api-cookies-list.json';
export const COOKIES_CACHE_SESSION_TOKEN_KEY =
  'google-trends-api-session-token.json';
