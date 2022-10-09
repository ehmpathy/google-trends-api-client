import { getTestCookieCache } from './__test_assets__/getTestCookieCache';
import { getTestRequestsCache } from './__test_assets__/getTestRequestsCache';
import { getInterestOverTime } from './getInterestOverTime';
import { getProxyConfig } from './__test_assets__/getProxyConfig';

describe('getInterestOverTime', () => {
  it('should be able to get interest over time', async () => {
    const proxyConfig = await getProxyConfig();
    const interest = await getInterestOverTime(
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
    // console.log(interest);
    expect(interest.length).toBeGreaterThan(0);
  });
});
