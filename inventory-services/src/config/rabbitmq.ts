import amqp from 'amqplib';

let channel: amqp.Channel;

const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    return channel;
};

export const getChannel = () => channel;


export const startRabbitMQ = async () => {
    const channel = await connectRabbitMQ();
    await channel.assertExchange('order', 'topic', { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, 'order', 'order.created');

    channel.consume(q.queue, (msg) => {
        if (msg) {
            const content = JSON.parse(msg.content.toString());
            console.log('Inventory Service received:', content);
            channel.ack(msg);
        }
    });

    console.log('Inventory Service listening to order.created');
};

