const amqp = require("amqplib");

const connect = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "my-queue";
    const message = "Hello, 123123!";

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));

    console.log("Message sent:", message);

    channel.consume(queue, (msg) => {
      console.log("Received message:", msg.content.toString());
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

connect();
