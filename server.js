const express = require('express');
const { XrplClient } = require('xrpl-client');

const app = express();
const port = 3000;

const client = new XrplClient('wss://s.altnet.rippletest.net:51233');

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
