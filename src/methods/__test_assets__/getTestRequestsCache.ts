import { createCache } from '../../../../simple-on-disk-cache/src/cache';

export const getTestRequestsCache = () =>
  createCache({
    directoryToPersistTo: {
      mounted: { path: `${__dirname}/__tmp__/requests` },
    },
    defaultSecondsUntilExpiration: 60 * 60 * 24 * 30, // cache for up to a month, for tests
  });
