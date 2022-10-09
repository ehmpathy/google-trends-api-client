import { CookiesCache } from './agent/cookies/common';
import { ProxyConfig } from './agent/useProxyIfPossible';

export const GOOGLE_TRENDS_API_HOST = `https://trends.google.com`;

export interface RequestsCache {
  set: (key: string, value: Promise<string>) => Promise<void>;
  get: (key: string) => Promise<string | undefined>;
}

/**
 * agent options control how you are seen when sending your requests
 *
 * relevance
 * - google tracks each agent (ip, useragent, cookies) and associates a rate limit for each agent
 * - based on your agent's appearance, you may be assigned a bigger or smaller rate limit (cookies, useragent)
 * - you may change your agent to look like a completely new user (proxies)
 */
export interface AgentOptions {
  /**
   * the user agent is sent as a header on requests to the origin
   *
   * relevance
   * - it is possible that rate limiting is more stringent on unnatural user agents
   * - if you are being throttled, you may consider setting this to a natural value
   */
  userAgent?: string;

  /**
   * the cookie cache is used to receive and send cookies across requests
   *
   * relevance
   * - google domains try to assign a cookie to every user that visits their website
   * - anecdotal evidence shows that these cookies make agents look more natural, and lessen rate limiting restrictions
   *
   * note
   * - you will want your cookie cache to persist the cookies to disk or database, so that they are not lost when the in-memory data clears
   *
   * for example
   * - https://github.com/uladkasach/simple-on-disk-cache - supports local and s3 caching
   */
  cookieCache?: CookiesCache;

  /**
   * a proxy can be used to change the ip address that the origin sees from your request
   *
   * relevance
   * - if you use a new ip, you will be seen as a new user, resetting your rate limiting counter
   *
   * note
   * - if you are also using cookie cache (recommended) you will need to clear your cache any time you change your ip.
   *   - otherwise, the cookie will identify you
   */
  proxyConfig?: ProxyConfig;

  /**
   * the request cache is used to prevent sending duplicate requests to goole
   *
   * relevance
   * - google will rate limit the number of requests you make
   * - dont send duplicate requests, to maximize how much value you get from the requests you're allocated
   *
   * note
   * - you will want your requests cache to persist the responses to disk or database, so that they are not lost when the in-memory data clears
   *
   * for example
   * - https://github.com/uladkasach/simple-on-disk-cache - supports local and s3 caching
   */
  requestCache?: RequestsCache;
}

export interface GoogleTrendsApiTopic {
  /**
   * for example
   * - "/m/03dg8j"
   */
  mid: string;

  /**
   * for example:
   * - "title":"Mattress"
   */
  title: string;

  /**
   * for example:
   * - "type":"Topic"
   * - "type":"Outlet store company"
   */
  type: string;
}
