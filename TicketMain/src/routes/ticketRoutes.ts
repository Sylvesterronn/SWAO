import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ticketRoutes = express.Router();

// Seed endpoint must come BEFORE /tickets/:id to avoid route conflicts

// GET /tickets — supports ?category=, ?status=, ?venue= filters
ticketRoutes.get('/tickets', async (req, res) => {
    return res.status(200).json("This endpoint will return a list of tickets, optionally filtered by category, status, or venue.");
});

// POST /tickets — create a new ticket
ticketRoutes.post('/tickets', async (req, res) => {
    return res.status(201).json("This endpoint will create a new ticket with the provided details in the request body.");
});

// GET /tickets/:id — get a single ticket
ticketRoutes.get('/tickets/:id', async (req, res) => {
    return res.status(200).json(`This endpoint will return the details of ticket with ID ${req.params.id}.`);
});

// PUT /tickets/:id — full update
/*ticketRoutes.put('/tickets/:id', async (req, res) => {
    return res.status(200).json(ticket);
});*/

// PATCH /tickets/:id — partial update (e.g. mark as sold, assign purchasedBy)
/*ticketRoutes.patch('/tickets/:id', async (req, res) => {
    try {
        const ticket = await ticketModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found.' });
            return;
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to partially update ticket.', details: (error as Error).message });
    }
});*/

// DELETE /tickets/:id
/*ticketRoutes.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await ticketModel.findByIdAndDelete(req.params.id);
        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found.' });
            return;
        }
        res.status(200).json({ message: `Ticket ${req.params.id} deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ticket.', details: (error as Error).message });
    }
});*/

export default ticketRoutes;

