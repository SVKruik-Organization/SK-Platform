import amqp, { Channel, Message, Replies } from "amqplib";
import shell from "shelljs";
import { UplinkMessage } from "~/assets/customTypes";

export default defineNitroPlugin(async (_nitroApp) => {
    const runtimeConfig = useRuntimeConfig();
    const channel: Channel | null = await (await amqp.connect({
        "protocol": "amqp",
        "hostname": runtimeConfig.uplink_host,
        "port": parseInt(runtimeConfig.uplink_port as string),
        "username": runtimeConfig.uplink_username,
        "password": runtimeConfig.uplink_password
    })).createChannel();

    if (!channel) throw new Error("Uplink connection missing.");
    channel.assertExchange("unicast-products", "direct", { durable: false });
    const queue: Replies.AssertQueue = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(queue.queue, "unicast-products", "platform");
    console.log("Uplink consumer listening on exchange 'unicast-products' binded to 'platform'.");

    // Listen
    channel.consume(queue.queue, (message: Message | null) => {
        if (message) {
            const messageContent: UplinkMessage = JSON.parse(message.content.toString());
            if (messageContent.task === "Deploy" && process.platform === "linux") {
                console.log(`Received new deploy task from ${messageContent.sender}. Running Server deployment script.`);
                shell.exec("bash deploy.sh");
                channel.ack(message);
            }
        }
    }, { noAck: false });
});