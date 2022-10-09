import { Cookie } from 'simple-cookie-client';

import { CookiesCache, COOKIES_CACHE_COOKIES_LIST_KEY } from './common';

export const getCookiesFromCookieCacheIfPossible = async ({
  cookieCache,
}: {
  cookieCache?: CookiesCache;
}): Promise<Cookie[] | null> => {
  // if no cache, not possible
  if (!cookieCache) return null;

  // lookup the values from the cache
  const cookiesSerialized = await cookieCache.get(
    COOKIES_CACHE_COOKIES_LIST_KEY,
  );
  if (!cookiesSerialized) return null;

  // deserialize the cookies, if they exist
  const cookies: Cookie[] = JSON.parse(cookiesSerialized);
  return cookies ?? [];
};
