const redis = require("redis");
const { RedisErrorResponse } = require("../core/error.response");
const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10 * 1000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: "Redis loi roi",
      en: "Redis connect error",
    },
  };

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message,
      statusCode: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionredis - connection status: connected`);
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`connectionredis - connection status: disconnected`);
    handleTimeoutError();
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionredis - connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.ERROR, (error) => {
    console.log(`connectionredis - connection status: error:  ${error}`);
    handleTimeoutError();
  });
};
const initRedis = () => {
  const instanceRedis = redis.createClient({});
  client.instanceConnect = instanceRedis;
  handleEventConnect({
    connectionRedis: instanceRedis,
  });
};

const getRedis = () => {
  return client;
};

const closeRedis = () => {
  return client.instanceConnect.disconnect();
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
