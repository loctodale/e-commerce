const amqp = require("amqplib");
const messages = "hello rabbitmq";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`message send: ${messages}`);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch((err) => console.error(err));
