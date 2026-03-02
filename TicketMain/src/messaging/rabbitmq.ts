#!/usr/bin/env node
import amqplib, { type Channel, type ChannelModel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function connectRabbitMQ(): Promise<void> {
  try {
    const conn = await amqplib.connect(RABBITMQ_URL);
    connection = conn;
    channel = await conn.createChannel();
    console.log("Connected to RabbitMQ");

    conn.on("error", (err: Error) => {
      console.error("RabbitMQ connection error:", err.message);
      connection = null;
      channel = null;
    });

    conn.on("close", () => {
      console.warn("RabbitMQ connection closed");
      connection = null;
      channel = null;
    });
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", (err as Error).message);
  }
}

export async function publishMessage(
  exchange: string,
  routingKey: string,
  message: object
): Promise<void> {
  if (!channel) {
    console.warn("RabbitMQ channel not available, skipping publish");
    return;
  }

  await channel.assertExchange(exchange, "topic", { durable: true });

  const payload = Buffer.from(JSON.stringify(message));
  channel.publish(exchange, routingKey, payload, { persistent: true });

  console.log(`[RabbitMQ] Published to ${exchange}/${routingKey}:`, message);
}
