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
 * > Numbers represent search interest relative to the highest point on the chart for the given region and time.
 * > - A value of 100 is the peak popularity for the term.
 * > - A value of 50 means that the term is half as popular.
 * > - A score of 0 means there was not enough data for this term.
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
  const result = JSON.parse(response);
  return result.default
    .timelineData as GoogleTrendsApiInterestOverTimeDatapoint[];
};
