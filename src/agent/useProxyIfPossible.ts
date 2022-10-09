export interface ProxyConfig {
  username: string;
  password: string;
  host: string;
  port: string;
}

export const useProxyUrlIfPossible = async ({
  proxyConfig,
}: {
  proxyConfig?: ProxyConfig;
}) => {
  if (!proxyConfig) return null;
  return {
    proxyUrl: `http://${proxyConfig.username}:${proxyConfig.password}@${proxyConfig.host}:${proxyConfig.port}`,
  };
};
