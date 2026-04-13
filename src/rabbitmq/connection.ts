import amqplib, { type ChannelModel, type Channel } from "amqplib";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

/**
 * Connect to RabbitMQ and return the connection.
 * Reuses an existing connection if one is already open.
 */
export async function getConnection(): Promise<ChannelModel> {
  if (connection) return connection;

  const conn = await amqplib.connect(RABBITMQ_URL);
  connection = conn;
  console.log("✅ Connected to RabbitMQ");

  conn.on("error", (err) => {
    console.error("RabbitMQ connection error:", err.message);
    connection = null;
    channel = null;
  });

  conn.on("close", () => {
    console.warn("RabbitMQ connection closed, will reconnect on next use");
    connection = null;
    channel = null;
  });

  return conn;
}

/**
 * Get (or create) a channel on the current connection.
 * Reuses an existing channel if one is already open.
 */
export async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  const conn = await getConnection();
  const ch = await conn.createChannel();
  channel = ch;
  console.log("✅ RabbitMQ channel created");

  ch.on("error", (err) => {
    console.error("RabbitMQ channel error:", err.message);
    channel = null;
  });

  ch.on("close", () => {
    console.warn("RabbitMQ channel closed");
    channel = null;
  });

  return ch;
}

/**
 * Gracefully close channel and connection.
 */
export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await connection.close();
      connection = null;
    }
    console.log("RabbitMQ connection closed gracefully");
  } catch (err) {
    console.error("Error closing RabbitMQ:", (err as Error).message);
  }
}
