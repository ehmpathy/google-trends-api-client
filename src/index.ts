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

export { CookiesCache } from './agent/cookies/common';
export * from './common';
export {
  GoogleTrendsApiInterestOverTimeDatapoint,
  GoogleTrendsApiRelatedQueryRankedKeyword,
  GoogleTrendsApiRelatedQueryRankedTopic,
};

export const trends = {
  getAutocompleteSuggestions,
  getInterestOverTime,
  getRelatedQueries,
  getRelatedTopics,
};
