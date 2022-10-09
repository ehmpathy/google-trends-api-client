import { getTestCookieCache } from './__test_assets__/getTestCookieCache';
import { getTestRequestsCache } from './__test_assets__/getTestRequestsCache';
import { getRelatedQueries } from './getRelatedQueries';
import { getProxyConfig } from './__test_assets__/getProxyConfig';

describe('getRelatedQueries', () => {
  it('should be able to get related queries', async () => {
    const proxyConfig = await getProxyConfig();
    const queries = await getRelatedQueries(
      {
        keywords: ['mattress recycling'],
        geo: 'US',
        category: 0, // all categories
        property: '', // web search
      },
      {
        proxyConfig,
        cookieCache: getTestCookieCache(),
        requestCache: getTestRequestsCache(),
      },
    );
    // console.log(JSON.stringify(queries, null, 2));
    expect(queries.top.length).toBeGreaterThan(0);
    expect(queries.rising.length).toBeGreaterThan(0);
  });
});
