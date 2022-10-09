import { UnexpectedCodePathError } from '../utils/errors/UnexpectedCodePathError';
import { defineCommonGoogleTrendsApiParametersValue } from '../assertions/defineCommonGoogleTrendsApiParametersValue';
import { GoogleTrendsApiTopic } from '../common';
import { getExplorationWidgets } from './getExplorationWidgets';
import { getFromApiCall } from './getFromApiCall';

export interface GoogleTrendsApiRelatedQueryRankedTopic {
  topic: GoogleTrendsApiTopic;
  value: number;
  formattedValue: string;
  hasData?: boolean;
  link: string;
}

/**
 * per google
 * > Users searching for your term also searched for these topics.
 * > You can sort by the following metrics:
 * >  - TOP
 * >    - The most popular topics.
 * >    - Scoring is on a relative scale where a value of 100 is the most commonly searched topic, 50 is a query searched half as often as the most popular topic, and so on.
 * >  - RISING
 * >    - Related topics with the biggest increase in search frequency since the last time period.
 * >    - Results marked "Breakout" had a tremendous increase, probably because these topics are new and had few (if any) prior searches.
 */
export const getRelatedTopics = async (
  ...args: Parameters<typeof getExplorationWidgets>
) => {
  // get the exploration widgets for this request, which give us the request token and params to get the related queries data
  const { widgets } = await getExplorationWidgets(...args);

  // find the relevant widget
  const relevantWidget = widgets.find(
    (widget) => widget.id === 'RELATED_TOPICS',
  );
  if (!relevantWidget)
    throw new UnexpectedCodePathError(
      'could not find widget with id RELATED_TOPICS',
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
  const result = JSON.parse(response);
  return {
    top: result.default.rankedList[0]
      .rankedKeyword as GoogleTrendsApiRelatedQueryRankedTopic[],
    rising: result.default.rankedList[1]
      .rankedKeyword as GoogleTrendsApiRelatedQueryRankedTopic[],
  };
};
