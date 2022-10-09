import { UnexpectedCodePathError } from '../utils/errors/UnexpectedCodePathError';
import { defineCommonGoogleTrendsApiParametersValue } from '../assertions/defineCommonGoogleTrendsApiParametersValue';
import { getExplorationWidgets } from './getExplorationWidgets';
import { getFromApiCall } from './getFromApiCall';

export interface GoogleTrendsApiRelatedQueryRankedKeyword {
  query: string;
  value: number;
  formattedValue: string;
  hasData?: boolean;
  link: string;
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
export const getRelatedQueries = async (
  ...args: Parameters<typeof getExplorationWidgets>
) => {
  // get the exploration widgets for this request, which give us the request token and params to get the related queries data
  const { widgets } = await getExplorationWidgets(...args);

  // find the relevant widget
  const relevantWidget = widgets.find(
    (widget) => widget.id === 'RELATED_QUERIES',
  );
  if (!relevantWidget)
    throw new UnexpectedCodePathError(
      'could not find widget with id RELATED_QUERIES',
    );

  // make the the request for the widgets data
  const response = await getFromApiCall({
    path: 'trends/api/widgetdata/relatedsearches',
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
  return {
    top: result.default.rankedList[0]
      .rankedKeyword as GoogleTrendsApiRelatedQueryRankedKeyword[],
    rising: result.default.rankedList[1]
      .rankedKeyword as GoogleTrendsApiRelatedQueryRankedKeyword[],
  };
};
