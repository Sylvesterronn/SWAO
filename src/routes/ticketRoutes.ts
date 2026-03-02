import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "../db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ticketRoutes = express.Router();

// Seed endpoint must come BEFORE /tickets/:id to avoid route conflicts

// POST /tickets/seed — truncate and re-insert mock data
ticketRoutes.post("/tickets/seed", async (req, res) => {
  try {
    const dataPath = path.resolve(
      __dirname,
      "../../data/MOCK_DATA_TICKETS.json",
    );
    const raw = fs.readFileSync(dataPath, "utf-8");
    const tickets = JSON.parse(raw);

    await prisma.ticket.deleteMany();
    await prisma.ticket.createMany({ data: tickets });

    return res
      .status(201)
      .json({ message: `Seeded ${tickets.length} tickets successfully.` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Seeding failed.", details: (error as Error).message });
  }
});

// GET /tickets — supports ?category=, ?status=, ?venue= filters
ticketRoutes.get("/tickets", async (req, res) => {
  try {
    const { category, status, venue } = req.query;

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(category ? { category: String(category) } : {}),
        ...(status ? { status: String(status) } : {}),
        ...(venue
          ? { venue: { contains: String(venue), mode: "insensitive" } }
          : {}),
      },
      orderBy: { eventDate: "asc" },
    });

    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch tickets.",
      details: (error as Error).message,
    });
  }
});

// POST /tickets — create a new ticket
ticketRoutes.post("/tickets", async (req, res) => {
  try {
    const ticket = await prisma.ticket.create({ data: req.body });
    return res.status(201).json(ticket);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create ticket.",
      details: (error as Error).message,
    });
  }
});

// GET /tickets/:id — get a single ticket
ticketRoutes.get("/tickets/:id", async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch ticket.",
      details: (error as Error).message,
    });
  }
});

// PATCH /tickets/:id — partial update (e.g. mark as sold, assign purchasedBy)
ticketRoutes.patch("/tickets/:id", async (req, res) => {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update ticket.",
      details: (error as Error).message,
    });
  }
});

// DELETE /tickets/:id
ticketRoutes.delete("/tickets/:id", async (req, res) => {
  try {
    await prisma.ticket.delete({ where: { id: Number(req.params.id) } });
    return res
      .status(200)
      .json({ message: `Ticket ${req.params.id} deleted successfully.` });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete ticket.",
      details: (error as Error).message,
    });
  }
});

export default ticketRoutes;
