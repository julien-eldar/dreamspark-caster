require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use((req, res, next) => {
  console.log(`Route requested: ${req.method} ${req.path}`);
  next();
});
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'));
  });
}

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Database sync error:', err));