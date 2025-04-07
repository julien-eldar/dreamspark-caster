require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

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
//app.use('/upload', uploadRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './client/build')));
  console.log('Registering route: * for static files'); // Add this
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'));
  });
}

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Database sync error:', err));