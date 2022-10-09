import crypto from 'crypto';
import { gotScraping, OptionsInit, Response } from 'got-scraping';
import { createUrl } from 'url-fns';
import { withSimpleCaching } from 'with-simple-caching';

import { getCookiesHeadersFromCookieCacheIfPossible } from '../agent/cookies/getCookiesHeadersFromCookieCacheIfPossible';
import { setCookiesFromAxiosResponseIfPossible } from '../agent/cookies/setCookiesFromAxiosResponseIfPossible';
import { useSessionTokenForCookieCacheIfPossible } from '../agent/cookies/useSessionTokenForCookieCacheIfPossible';
import { getUserAgentHeadersIfPossible } from '../agent/getUserAgentHeaderIfPossible';
import { useProxyUrlIfPossible } from '../agent/useProxyIfPossible';
import { AgentOptions, GOOGLE_TRENDS_API_HOST } from '../common';

const gotScrapingTyped = gotScraping as (
  options: OptionsInit,
) => Promise<Response<string>>;

export const getFromApiCallWithoutRequestCaching = async ({
  origin = GOOGLE_TRENDS_API_HOST,
  path,
  queryParams,
  pathParams,
  agentOptions: { userAgent, proxyConfig, cookieCache } = {},
}: {
  origin?: string;
  path: string;
  queryParams?: Parameters<typeof createUrl>[0]['queryParams'];
  pathParams?: Parameters<typeof createUrl>[0]['pathParams'];
  agentOptions?: AgentOptions;
}): Promise<string> => {
  const response = await gotScrapingTyped({
    method: 'GET',
    ...useProxyUrlIfPossible({ proxyConfig }),
    ...useSessionTokenForCookieCacheIfPossible({ cookieCache }),
    headers: {
      ...getUserAgentHeadersIfPossible({ userAgent }),
      ...(await getCookiesHeadersFromCookieCacheIfPossible({ cookieCache })),
    },
    url: createUrl({
      origin,
      path,
      pathParams,
      queryParams,
    }),
    throwHttpErrors: true,
  });
  await setCookiesFromAxiosResponseIfPossible({ response, cookieCache });
  if (origin === GOOGLE_TRENDS_API_HOST)
    return response.body.replace(/^([^{]+)/g, ''); // for somereason, resopnse starts with `)]}',\n`, so delete everything before the first `{`; NOTE: do so here, so if caching, it is saved to cache without this
  return response.body;
};

export const getFromApiCall = (
  args: Parameters<typeof getFromApiCallWithoutRequestCaching>[0],
) => {
  // if there's no request cache defined, just make the request directly
  const requestCache = args.agentOptions?.requestCache;
  if (!requestCache) return getFromApiCallWithoutRequestCaching(args);

  // if there is a request cache, then make the request with caching
  return withSimpleCaching(getFromApiCallWithoutRequestCaching, {
    cache: requestCache,
    serialize: {
      key: (key) =>
        [
          key[0].path.replace(/\//g, '.').replace(/:/g, '_'),
          crypto.createHash('sha256').update(JSON.stringify(key)).digest('hex'),
          'json',
        ].join('.'),
    },
  })(args);
};
