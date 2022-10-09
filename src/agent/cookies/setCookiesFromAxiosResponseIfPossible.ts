import { Cookie, getCookiesFromHeader } from 'simple-cookie-client';

import { CookiesCache, COOKIES_CACHE_COOKIES_LIST_KEY } from './common';
import { getCookiesFromCookieCacheIfPossible } from './getCookiesFromCookieCache';

export const setCookiesFromAxiosResponseIfPossible = async ({
  response,
  cookieCache,
}: {
  response: { headers: Record<string, string | string[] | undefined> };
  cookieCache?: CookiesCache;
}) => {
  // if no cache, nothing to do
  if (!cookieCache) return null;

  // grab the new cookies from headers
  const newCookies = getCookiesFromHeader({ header: response.headers });

  // merge them with the old cookies, overwrite the old ones by name
  const oldCookies =
    (await getCookiesFromCookieCacheIfPossible({ cookieCache })) ?? [];
  const oldCookiesMap = oldCookies.reduce((summary, thisCookie) => {
    return { ...summary, [thisCookie.name]: thisCookie };
  }, {} as Record<string, Cookie>);
  const mergedCookiesMap = newCookies.reduce((summary, thisCookie) => {
    return { ...summary, [thisCookie.name]: thisCookie };
  }, oldCookiesMap); // initialize w/ old cookies map to overwrite old cookies
  const mergedCookies = Object.values(mergedCookiesMap);

  // save to cache
  return await cookieCache.set(
    COOKIES_CACHE_COOKIES_LIST_KEY,
    JSON.stringify(mergedCookies, null, 2),
  );
};
