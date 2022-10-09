export const getUserAgentHeadersIfPossible = ({
  userAgent,
}: {
  userAgent?: string;
}) => {
  if (!userAgent) return null;
  return {
    'user-agent': userAgent,
  };
};
