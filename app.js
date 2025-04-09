const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('--- Starting ABSOLUTE MINIMAL app ---');

// Test route
app.get('/test', (req, res) => {
    res.send('Test route OK');
});

// Catch-all route
console.log('Registering minimal catch-all route');
app.get('/:path*', (req, res) => {
    console.log('Catch-all hit for:', req.path);
    res.send('Minimal Fallback OK');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).send('Server Error!');
});