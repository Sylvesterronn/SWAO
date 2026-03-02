import express from 'express';
import ticketRoutes from './routes/ticketRoutes.js';

const hostname = '0.0.0.0';
const port = 3000;
const app = express();

app.use(express.json());

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

app.use('', ticketRoutes);

// Error handling middleware - must be after all routes
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


