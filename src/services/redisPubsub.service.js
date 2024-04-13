const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subcriberChannel, message) => {
      if (channel === subcriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
