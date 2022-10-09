import {
  CommonGoogleTrendsApiParameters,
  defineCommonGoogleTrendsApiParametersValue,
} from '../assertions/defineCommonGoogleTrendsApiParametersValue';
import { AgentOptions, GoogleTrendsApiTopic } from '../common';
import { getFromApiCall } from './getFromApiCall';

/**
 * provides suggestions of search terms and topics which you can get trends data on
 *
 * for example:
 * - https://trends.google.com/trends/api/autocomplete/mattress?hl=en-US&tz=240
 */
export const getAutocompleteSuggestions = async (
  { keyword, hl, tz }: { keyword: string } & CommonGoogleTrendsApiParameters,
  agentOptions: AgentOptions = {},
): Promise<GoogleTrendsApiTopic[]> => {
  const response = await getFromApiCall({
    path: 'trends/api/autocomplete/:keyword',
    agentOptions,
    pathParams: {
      keyword,
    },
    queryParams: {
      ...defineCommonGoogleTrendsApiParametersValue({ hl, tz }),
    },
  });
  const resultJson = response.replace(/^([^{]+)/g, ''); // for somereason, resopnse starts with `)]}',\n`, so delete everything before the first `{`
  const result = JSON.parse(resultJson);
  return result.default.topics as GoogleTrendsApiTopic[];
};
