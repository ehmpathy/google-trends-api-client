import { getTestCookieCache } from './__test_assets__/getTestCookieCache';
import { getTestRequestsCache } from './__test_assets__/getTestRequestsCache';
import { getRelatedTopics } from './getRelatedTopics';
import { getProxyConfig } from './__test_assets__/getProxyConfig';

describe('getRelatedTopics', () => {
  it('should be able to get related topics', async () => {
    const proxyConfig = await getProxyConfig();
    const topics = await getRelatedTopics(
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
    console.log(JSON.stringify(topics, null, 2));
  });
});
