const amqplib = require("amqplib");

const amqpUrl = "amqp://localhost:5672";
const receiveMessage = async () => {
  try {
    // connect
    const conn = await amqplib.connect(amqpUrl);
    // create channel
    const channel = await conn.createChannel();
    // name channel
    const firstQueue = "first-queue";
    // create first queue and assert it into channel
    await channel.assertQueue(firstQueue, { durable: false });
    // consume message
    await channel.consume(
      firstQueue,
      (msg) => {
        console.log("Message received: ", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log("error", error);
  }
};

receiveMessage();
