import * as amqp from 'amqplib';

export async function publishToQueue(queueName: string, channel: amqp.Channel, message: any) {
    try {
        const messageBuffer = Buffer.from(JSON.stringify(message));

        const isSent = channel.sendToQueue(queueName, messageBuffer, {
            persistent: true, // Make the message persistent across server restarts
            // ... other options
        });

        if (isSent) {
            console.log(`Message "${JSON.stringify(message)}" sent to queue "${queueName}"`);
        } else {
            console.warn(`Message "${JSON.stringify(message)}" was not accepted by the queue.`);
            // This can happen if the channel's internal buffer is full.
            // Consider using channel.waitForDrain() in high-throughput scenarios.
        }
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}
