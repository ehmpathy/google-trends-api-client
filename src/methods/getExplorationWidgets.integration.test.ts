import { getTestCookieCache } from './__test_assets__/getTestCookieCache';
import { getTestRequestsCache } from './__test_assets__/getTestRequestsCache';
import { getExplorationWidgets } from './getExplorationWidgets';
import { getProxyConfig } from './__test_assets__/getProxyConfig';

describe('getExplorationWidgets', () => {
  it('should be able to get exploration widgets', async () => {
    const proxyConfig = await getProxyConfig();
    const data = await getExplorationWidgets(
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
    expect(data.widgets.length).toBeGreaterThan(0);
    // console.log(JSON.stringify(data, null, 2));
  });
});
