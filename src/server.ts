import "dotenv/config";
import express from "express";
import ticketRoutes from "./routes/ticketRoutes.js";
import { setupTicketExchange } from "./rabbitmq/ticketExchange.js";
import { closeRabbitMQ } from "./rabbitmq/connection.js";

const hostname = "0.0.0.0";
const port = 3000;
const app = express();

app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.use("", ticketRoutes);

// Error handling middleware - must be after all routes
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  },
);

app.listen(port, hostname, async () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  // Initialize RabbitMQ exchange, queues, and bindings
  try {
    await setupTicketExchange();
    console.log("RabbitMQ ticket exchange ready");
  } catch (err) {
    console.error("Failed to set up RabbitMQ:", (err as Error).message);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await closeRabbitMQ();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down...");
  await closeRabbitMQ();
  process.exit(0);
});
