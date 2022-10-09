import {
  getRelatedTopics,
  GoogleTrendsApiRelatedQueryRankedTopic,
} from './methods/getRelatedTopics';
import {
  getRelatedQueries,
  GoogleTrendsApiRelatedQueryRankedKeyword,
} from './methods/getRelatedQueries';
import {
  getInterestOverTime,
  GoogleTrendsApiInterestOverTimeDatapoint,
} from './methods/getInterestOverTime';
import { getAutocompleteSuggestions } from './methods/getAutocompleteSuggestions';
import { getFromApiCall } from './methods/getFromApiCall';
import {
  getExplorationWidgets,
  GoogleTrendsApiExplorationWidget,
} from './methods/getExplorationWidgets';

export { CookiesCache } from './agent/cookies/common';
export * from './common';
export {
  GoogleTrendsApiInterestOverTimeDatapoint,
  GoogleTrendsApiRelatedQueryRankedKeyword,
  GoogleTrendsApiRelatedQueryRankedTopic,
  GoogleTrendsApiExplorationWidget,
};

export const trends = {
  getAutocompleteSuggestions,
  getInterestOverTime,
  getRelatedQueries,
  getRelatedTopics,
  getFromApiCall,
  getExplorationWidgets,
};
