import { CookiesCache, COOKIES_CACHE_SESSION_TOKEN_KEY } from './common';

/**
 * we use a session-token to send the same user-agent through got-scraping when using cookies
 * - that way, when the site assigns an id cookie to our browser, they dont suddenly see a new browser with that same id
 */
export const findOrCreateSessionTokenForCookieCache = async ({
  cookieCache,
}: {
  cookieCache: CookiesCache;
}): Promise<string> => {
  // try to find it
  const foundSessionToken = await cookieCache.get(
    COOKIES_CACHE_SESSION_TOKEN_KEY,
  );
  if (foundSessionToken) return foundSessionToken;

  // create it if not found
  await cookieCache.set(
    COOKIES_CACHE_SESSION_TOKEN_KEY,
    `${new Date().getTime()}`,
  );
  return findOrCreateSessionTokenForCookieCache({ cookieCache }); // and run it again now, since it is now set
};

export const useSessionTokenForCookieCacheIfPossible = ({
  cookieCache,
}: {
  cookieCache?: CookiesCache;
}) => {
  // if no cache, not possible
  if (!cookieCache) return null;

  // otherwise, find or create it
  return findOrCreateSessionTokenForCookieCache({ cookieCache });
};
