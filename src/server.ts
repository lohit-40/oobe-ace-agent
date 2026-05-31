import express from 'express';
import cors from 'cors';
import { runAgent } from './agent';

const app = express();
app.use(cors());

app.get('/api/run', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ log: "Starting server connection..." })}\n\n`);

    runAgent((msg) => {
        res.write(`data: ${JSON.stringify({ log: msg })}\n\n`);
    }).then(() => {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    }).catch((err) => {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    });
});

app.listen(3000, () => {
    console.log('API Server running on port 3000');
});
