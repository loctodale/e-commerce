const redis = require("redis");
const { promisify } = require("util");
const inventoryRepo = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`;
  const retryTime = 10;
  const expireTime = 3000;
  for (let i = 0; i < retryTime; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(`result: ${result}`);
    if (result === 1) {
      const isReservation = await inventoryRepo.reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keylock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keylock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
