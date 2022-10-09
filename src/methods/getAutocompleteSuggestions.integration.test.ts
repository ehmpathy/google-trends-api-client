import { getTestCookieCache } from './__test_assets__/getTestCookieCache';
import { getTestRequestsCache } from './__test_assets__/getTestRequestsCache';
import { getAutocompleteSuggestions } from './getAutocompleteSuggestions';
import { getProxyConfig } from './__test_assets__/getProxyConfig';

describe('getAutocompleteSuggestions', () => {
  it('should be able to get suggestions', async () => {
    const proxyConfig = await getProxyConfig();
    const suggestions = await getAutocompleteSuggestions(
      {
        keyword: 'mattre',
        tz: 240,
        hl: 'en-US',
      },
      {
        proxyConfig,
        cookieCache: getTestCookieCache(),
        requestCache: getTestRequestsCache(),
      },
    );
    expect(suggestions.length).toBeGreaterThan(0);
  });
});
