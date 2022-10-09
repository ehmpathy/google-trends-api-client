import { assertValidGoogleTrendsApiTime } from '../assertions/assertValidGoogleTrendsApiTime';
import {
  CommonGoogleTrendsApiParameters,
  defineCommonGoogleTrendsApiParametersValue,
} from '../assertions/defineCommonGoogleTrendsApiParametersValue';
import { AgentOptions } from '../common';
import { getFromApiCall } from './getFromApiCall';

export interface CommonGoogleTrendsApiExplorationParamters {
  /**
   * the keywords you want to fetch trends data for or compare
   *
   * for example:
   * - `['disposal', 'recycling']
   */
  keywords: string[];

  /**
   * the geographical area you want to scope the analysis to
   *
   * defaults to 'US'
   *
   * for example:
   * - `US`
   */
  geo?: string;

  /**
   * the relative time range you want to scope the analysis to
   *
   * defaults to `today 12-m`, past 12 months
   *
   * for example:
   * - `now 4-h` = past 4 hours
   * - `now 1-d` = past day
   * - `now 7-d` = past 7 days
   * - `today 1-m` = past 30 days
   * - `today 3-m` = past 90 days
   * - `today 12-m` = past 12 months
   * - `today 5-y` = past 5 years
   * - `all` = 2004 to present
   */
  time?: string;

  /**
   * the category you want to scope the analysis to
   *
   * defaults to `0`, all categories
   *
   * for example
   * - `0` = all categories
   * - `11` = home and garden
   * - `29` = real estate
   */
  category?: number;

  /**
   * the properties from which you want to include search data
   *
   * defaults to ``, web search
   *
   * for example:
   * - `` = web search
   * - `images` = image search
   * - `news` = news search
   * - `froogle` = google shopping search
   * - `youtube` = youtube search
   */
  property?: string;
}

export interface GoogleTrendsApiExplorationWidget {
  /**
   * the request object is conviniently provided by google to help us make subsequent requests for the widgets data
   *
   * specifically
   * - we use this data as the `req` query parameter for the appropriate endpoint to get the data correctly
   * - this `request` is coupled with the token returned on the widget
   */
  request: Record<string, any>;

  /**
   * the help dialog describes what this widget's data tells us
   */
  helpDialog: {
    title: string;
    description: string;
    url: string;
  };

  /**
   * for example
   * - 'PALETTE_COLOR_1';
   */
  color: string;

  /**
   * for example
   * - 'mattress recycling';
   */
  keywordName: string;

  /**
   * the token needed to make the subsequent reqeust to fetch the widget's data
   * - to be used along with the `request` param
   */
  token: string;

  /**
   * for example
   * - 'RELATED_QUERIES';
   */
  id: string;

  /**
   * for example
   * - 'fe_related_searches';
   */
  type: string;

  /**
   * for example
   * - 'Related queries';
   */
  title: string;

  /**
   * for example
   * - 'fe';
   */
  template: string;

  /**
   * for example
   * - 'fe';
   */
  embedTemplate: string;

  /**
   * for example
   * - '1'
   */
  version: string;

  isLong: boolean;
  isCurated: boolean;
}

/**
 * google returns exploration widgets when you search for keywords, to build their web interface.
 *
 * for us, it has two uses:
 * - enumerating and describing all of the data that can be looked up
 * - defining the tokens required to access the data that can be looked up
 *
 * for example:
 * - https://trends.google.com/trends/api/explore?hl=en-US&tz=240&req=%7B%22comparisonItem%22:%5B%7B%22keyword%22:%22mattress+disposal%22,%22geo%22:%22US%22,%22time%22:%22today 12-m%22%7D%5D,%22category%22:0,%22property%22:%22%22%7D&tz=240
 */
export const getExplorationWidgets = async (
  {
    keywords,
    geo,
    time,
    category,
    property,
    hl,
    tz,
  }: CommonGoogleTrendsApiExplorationParamters &
    CommonGoogleTrendsApiParameters,
  agentOptions: AgentOptions = {},
) => {
  const response = await getFromApiCall({
    path: 'trends/api/explore',
    agentOptions,
    queryParams: {
      ...defineCommonGoogleTrendsApiParametersValue({ hl, tz }),
      req: JSON.stringify({
        comparisonItem: keywords.map((keyword) => ({
          keyword,
          geo: geo ?? 'US',
          time: assertValidGoogleTrendsApiTime(time ?? 'today 12-m'),
        })),
        category: category ?? 0,
        property: property ?? '',
      }),
    },
  });
  const result = JSON.parse(response);
  return result as { widgets: GoogleTrendsApiExplorationWidget[] };
};
