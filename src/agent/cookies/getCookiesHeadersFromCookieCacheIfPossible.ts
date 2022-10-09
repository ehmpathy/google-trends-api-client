import { castCookiesToCookieHeaderString } from 'simple-cookie-client';

import { CookiesCache } from './common';
import { getCookiesFromCookieCacheIfPossible } from './getCookiesFromCookieCache';

export const getCookiesHeadersFromCookieCacheIfPossible = async ({
  cookieCache,
}: {
  cookieCache?: CookiesCache;
}) => {
  // lookup the values from the cache
  const cookies = await getCookiesFromCookieCacheIfPossible({ cookieCache });
  if (!cookies || !cookies.length) return null;

  // cast the cookies to header
  return {
    cookie: castCookiesToCookieHeaderString(cookies),
  };
};
