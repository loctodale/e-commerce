const amqp = require("amqplib");

async function producerOrderedMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "order";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered queue message ${i}`;
    console.log(message);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }
  setTimeout(() => {
    connection.close();
  }, 1000);
}

producerOrderedMessage().catch((err) => console.error(err));
