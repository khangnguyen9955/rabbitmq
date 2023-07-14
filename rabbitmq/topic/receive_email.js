const amqplib = require("amqplib");
const amqpUrl = "amqp://localhost:5672";
const receiveEmail = async () => {
  try {
    const conn = await amqplib.connect(amqpUrl);
    const channel = await conn.createChannel();
    const nameExchange = "send_email";

    await channel.assertExchange(nameExchange, "topic", { durable: false }); // create exchange for routing message to subscribers

    const { queue } = await channel.assertQueue("", { exclusive: true }); // create queue for this subscriber
    // exclusive: true means that this queue will be deleted when the connection is closed

    const args = process.argv.slice(2);
    if (!args.length) {
      process.exit(0);
    }
    console.log(`Receiving from queue: ${queue} :::: topic::${args}`);

    args.forEach(async (key) => {
      await channel.bindQueue(queue, nameExchange, key);
    });
    //binding queue for many topics

    // consume message
    await channel.consume(
      queue,
      (msg) => {
        console.log(
          `Routing key :${
            msg.fields.routingKey
          } ::: msg:::${msg.content.toString()}`
        );
      },
      { noAck: true }
    );
  } catch (error) {
    console.log(error);
  }
};
receiveEmail();
