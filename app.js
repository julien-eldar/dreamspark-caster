require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');  
const uploadRoutes = require('./routes/upload'); 
const adminRoutes = require('./routes/admin'); // Import admin routes
const authenticateToken = require('./middleware/auth'); // Import middleware
const isAdmin = require('./middleware/isAdmin');     // Import middleware

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Route requested: ${req.method} ${req.path}`);
  next();
});

console.log('Registering route: /auth'); // Add this
app.use('/auth', authRoutes);
console.log('Registering route: /upload'); // Add this
app.use('/upload', authenticateToken, uploadRoutes);
//Admin Routes (Requires authentication AND admin role)
app.use('/admin', authenticateToken, isAdmin, adminRoutes);

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'client/build');
  console.log('Static path exists:', require('fs').existsSync(staticPath));
  console.log('Index.html exists:', require('fs').existsSync(path.join(staticPath, 'index.html')));

  app.use(express.static(staticPath));

  console.log('Registering simplified catch-all route'); // Changed log slightly
  // Use '/*' for safety, and simplify the handler
  app.get('/*', (req, res) => {
    console.log('Simplified catch-all hit for:', req.path);
    res.send('Fallback route OK'); // Simple text response
  });
}

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Database sync error:', err));