import { getChannel } from "./connection.js";

// Exchange configuration
const TICKET_EXCHANGE = "ticket.events";
const EXCHANGE_TYPE = "topic"; // topic exchange for flexible routing

// Routing keys
export const TicketRoutingKeys = {
  CREATED: "ticket.created",
  UPDATED: "ticket.updated",
  DELETED: "ticket.deleted",
  STATUS_CHANGED: "ticket.status.changed",
} as const;

// Queue names for consumers
export const TicketQueues = {
  TICKET_NOTIFICATIONS: "ticket.notifications",
  TICKET_AUDIT_LOG: "ticket.audit-log",
} as const;

/**
 * Set up the ticket exchange, queues, and bindings.
 * Call this once during application startup.
 */
export async function setupTicketExchange(): Promise<void> {
  const channel = await getChannel();

  // Assert the topic exchange (created if it doesn't exist)
  await channel.assertExchange(TICKET_EXCHANGE, EXCHANGE_TYPE, {
    durable: true, // survives broker restarts
  });
  console.log(`✅ Exchange "${TICKET_EXCHANGE}" (${EXCHANGE_TYPE}) asserted`);

  // Assert queues
  await channel.assertQueue(TicketQueues.TICKET_NOTIFICATIONS, {
    durable: true,
  });
  await channel.assertQueue(TicketQueues.TICKET_AUDIT_LOG, {
    durable: true,
  });

  // Bind queues to the exchange with routing key patterns
  // Notifications queue receives all ticket events
  await channel.bindQueue(
    TicketQueues.TICKET_NOTIFICATIONS,
    TICKET_EXCHANGE,
    "ticket.#", // matches ticket.created, ticket.updated, ticket.status.changed, etc.
  );

  // Audit log queue also receives all ticket events
  await channel.bindQueue(
    TicketQueues.TICKET_AUDIT_LOG,
    TICKET_EXCHANGE,
    "ticket.#",
  );

  console.log("✅ Ticket queues and bindings configured");
}

/**
 * Publish a ticket event to the ticket exchange.
 */
export async function publishTicketEvent(
  routingKey: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  try {
    const channel = await getChannel();

    const message = Buffer.from(
      JSON.stringify({
        event: routingKey,
        timestamp: new Date().toISOString(),
        data: payload,
      }),
    );

    const published = channel.publish(TICKET_EXCHANGE, routingKey, message, {
      persistent: true, // message survives broker restarts
      contentType: "application/json",
    });

    console.log(`📤 Published event: ${routingKey}`, payload);
    return published;
  } catch (err) {
    console.error(
      `Failed to publish event ${routingKey}:`,
      (err as Error).message,
    );
    return false;
  }
}

/**
 * Start consuming messages from a ticket queue.
 * Provide a handler function to process each message.
 */
export async function consumeTicketQueue(
  queue: string,
  handler: (msg: {
    event: string;
    timestamp: string;
    data: Record<string, unknown>;
  }) => void | Promise<void>,
): Promise<void> {
  const channel = await getChannel();

  await channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        channel.ack(msg);
      } catch (err) {
        console.error(
          `Error processing message from ${queue}:`,
          (err as Error).message,
        );
        // Reject and don't requeue on parse/handler errors
        channel.nack(msg, false, false);
      }
    },
    { noAck: false },
  );

  console.log(`🎧 Consuming messages from "${queue}"`);
}
