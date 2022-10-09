// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';

dotenv.config();

export const getProxyConfig = () => {
  return {
    username: process.env.CONFIG_PROXY_USERNAME!,
    password: process.env.CONFIG_PROXY_PASSWORD!,
    host: process.env.CONFIG_PROXY_HOST!,
    port: process.env.CONFIG_PROXY_PORT!,
  };
};
