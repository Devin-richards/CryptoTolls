const express = require('express');
const mongoose = require('mongoose');
const { XrplClient } = require('xrpl-client');
const { DebtToken, TollProject } = require('./data-model');
const TokenIssuer = require('./token-issuer');
const TollPricer = require('./toll-pricer');
const TrafficFeed = require('./traffic-feed');
const authRouter = require('./auth');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/crypto-tolls', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const client = new XrplClient('wss://s.altnet.rippletest.net:51233');
const tokenIssuer = new TokenIssuer('sEd72deR1PCVaehq6d3bsoqF9dYmZpG');
const tollPricer = new TollPricer(10); // Base rate of $10
let currentTrafficData = { congestion: 0.5 }; // Default traffic data

// Start the traffic feed
const trafficFeed = new TrafficFeed(trafficData => {
    currentTrafficData = trafficData;
});
trafficFeed.start();

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth routes
app.use('/api/auth', authRouter);

// API endpoints for managing toll projects
app.post('/api/projects', authenticateToken, async (req, res) => {
    const project = new TollProject(req.body);
    await project.save();
    res.json(project);
});

app.get('/api/projects', async (req, res) => {
    const projects = await TollProject.find();
    res.json(projects);
});

// API endpoints for managing debt tokens
app.post('/api/tokens', authenticateToken, async (req, res) => {
    const token = new DebtToken(req.body);
    await token.save();
    res.json(token);
});

app.get('/api/tokens', async (req, res) => {
    const tokens = await DebtToken.find().populate('projectId');
    res.json(tokens);
});

app.post('/api/issue-token', authenticateToken, async (req, res) => {
    const { tokenId, faceValue, maturityDate, interestRate } = req.body;
    await tokenIssuer.issueToken(tokenId, faceValue, maturityDate, interestRate);
    res.json({ success: true });
});

app.get('/api/toll-rate', async (req, res) => {
    const rate = tollPricer.calculateToll(currentTrafficData);
    res.json({ rate });
});

app.get('/api/revenue', async (req, res) => {
    // In a real application, you would fetch this data from a database
    // that is populated by a listener on the XRPL.
    // For this example, we'll just return some mock data.
    res.json({
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        data: [120, 135, 140, 130, 150, 160]
    });
});

app.get('/api/investments', async (req, res) => {
    // In a real application, you would fetch this data from a database
    // that is populated by a listener on the XRPL.
    // For this example, we'll just return some mock data.
    res.json([
        { project: 'Golden Gate Bridge', tokens: 5000, value: 5500, apy: '5.5%' },
        { project: 'Bay Bridge', tokens: 3000, value: 3200, apy: '6.0%' }
    ]);
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

module.exports = app;
