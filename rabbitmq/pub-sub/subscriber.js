const amqplib = require("amqplib");
const amqpUrl = "amqp://localhost:5672";
const subscribeAndConsumeMsg = async () => {
  try {
    const conn = await amqplib.connect(amqpUrl);
    const channel = await conn.createChannel();
    const nameExchange = "exchange-1";
    const { queue } = await channel.assertQueue("", { exclusive: true }); // create queue for this subscriber
    // exclusive: true means that this queue will be deleted when the connection is closed
    console.log("queue name: ", queue);

    // binding the queue to the exchange
    await channel.bindQueue(queue, nameExchange, ""); // bind queue to exchange-1 with routing key = ""
    // consume message
    await channel.consume(
      queue,
      (msg) => {
        console.log("Msg:", msg.content.toString());
      },
      { noAck: true }
    );
  } catch (error) {
    console.log(error);
  }
};
subscribeAndConsumeMsg();
