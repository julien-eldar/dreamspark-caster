// TEMPORARY app.js for minimal testing
const express = require('express');
const path = require('path'); // Keep path
const app = express();
const PORT = process.env.PORT || 5000;

console.log('--- Starting ABSOLUTE MINIMAL app ---');

// ONLY the problematic part pattern
console.log('Registering minimal catch-all route');
try {
    app.get('/:path*', (req, res) => {
        console.log('Minimal catch-all hit for:', req.path);
        // Even simpler: just send text
        res.send('Minimal Fallback OK');
    });
    console.log('Minimal catch-all route registered successfully.');
} catch (error) {
    console.error('ERROR registering minimal catch-all route:', error);
    process.exit(1); // Exit if registration itself fails
}


app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
});

// Add a basic error handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error in Minimal App:", err.stack);
    res.status(500).send('Minimal App Error!');
});