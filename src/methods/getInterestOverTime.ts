import { UnexpectedCodePathError } from '../utils/errors/UnexpectedCodePathError';
import { defineCommonGoogleTrendsApiParametersValue } from '../assertions/defineCommonGoogleTrendsApiParametersValue';
import { getExplorationWidgets } from './getExplorationWidgets';
import { getFromApiCall } from './getFromApiCall';

export interface GoogleTrendsApiInterestOverTimeDatapoint {
  /**
   * for example
   * - "1633824000",
   */
  time: string;

  /**
   * for example
   * - "Oct 10 – 16, 2021",
   */
  formattedTime: string;

  /**
   * for example
   * - "Oct 10, 2021",
   */
  formattedAxisTime: string;

  /**
   * one per keyword, in keyword order
   */
  value: number[];

  /**
   * one per keyword, in keyword order
   */
  formattedValue: number[];
}

/**
 * per google
 * > Users searching for your term also searched for these queries.
 * > You can sort by the following metrics:
 * >  - TOP
 * >    - The most popular search queries.
 * >    - Scoring is on a relative scale where a value of 100 is the most commonly searched query, 50 is a query searched half as often as the most popular query, and so on.
 * >  - RISING
 * >    - Queries with the biggest increase in search frequency since the last time period.
 * >    - Results marked "Breakout" had a tremendous increase, probably because these queries are new and had few (if any) prior searches.
 */
export const getInterestOverTime = async (
  ...args: Parameters<typeof getExplorationWidgets>
) => {
  // get the exploration widgets for this request, which give us the request token and params to get the related queries data
  const { widgets } = await getExplorationWidgets(...args);

  // find the relevant widget
  const relevantWidget = widgets.find((widget) => widget.id === 'TIMESERIES');
  if (!relevantWidget)
    throw new UnexpectedCodePathError(
      'could not find widget with id TIMESERIES',
    );

  // make the the request for the widgets data
  const response = await getFromApiCall({
    path: 'trends/api/widgetdata/multiline',
    agentOptions: args[1],
    queryParams: {
      ...defineCommonGoogleTrendsApiParametersValue({
        hl: args[0].hl,
        tz: args[0].tz,
      }),
      req: JSON.stringify(relevantWidget.request),
      token: relevantWidget.token,
    },
  });
  const resultJson = response.replace(/^([^{]+)/g, ''); // for somereason, resopnse starts with `)]}',\n`, so delete everything before the first `{`
  const result = JSON.parse(resultJson);
  return result.default
    .timelinedata as GoogleTrendsApiInterestOverTimeDatapoint[];
};
