const amqplib = require("amqplib");

const amqpUrl = "amqp://localhost:5672";
const sendChannel = async ({ msg }) => {
  try {
    // connect
    const conn = await amqplib.connect(amqpUrl);
    // create channel
    const channel = await conn.createChannel();
    // name channel
    const firstQueue = "first-queue";
    // create first queue and assert it into channel
    await channel.assertQueue(firstQueue, { durable: false });
    // send message to queue
    console.log(msg);
    await channel.sendToQueue(firstQueue, Buffer.from(msg));
  } catch (error) {
    console.log("error", error);
  }
};

sendChannel({ msg: "Hello World" });
