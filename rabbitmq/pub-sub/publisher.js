const amqplib = require("amqplib");
const amqpUrl = "amqp://localhost:5672";
const publishMessage = async ({ msg }) => {
  try {
    const conn = await amqplib.connect(amqpUrl);
    const channel = await conn.createChannel();
    const nameExchange = "exchange-1";
    await channel.assertExchange(nameExchange, "fanout", { durable: false }); // create exchange for routing message to subscribers
    await channel.publish(nameExchange, "", Buffer.from(msg)); // then publish our message
    console.log("Sent message: ", msg);
    setTimeout(() => {
      conn.close();
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
  }
};
let msg = process.argv.slice(2).join(" ") || "Hello World";
publishMessage({ msg });
