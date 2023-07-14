const amqplib = require("amqplib");
const amqpUrl = "amqp://localhost:5672";
const sendEmail = async () => {
  try {
    const conn = await amqplib.connect(amqpUrl);
    const channel = await conn.createChannel();
    const nameExchange = "send_email";
    await channel.assertExchange(nameExchange, "topic", { durable: false }); // create exchange for routing message to subscribers
    const args = process.argv.slice(2);
    const msg = args[1] || "Fixed";
    const topic = args[0];
    console.log(`Msg: ${msg} :::: topic:${topic}`);

    await channel.publish(nameExchange, topic, Buffer.from(msg)); // then publish our message
    console.log("Sent email: ", msg);
    setTimeout(() => {
      conn.close();
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
  }
};
sendEmail();
