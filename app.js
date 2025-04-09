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
//console.log('Registering route: /upload'); // Add this
//app.use('/upload', uploadRoutes);

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'client/build');
  const indexPath = path.join(staticPath, 'index.html');
  console.log('Static path exists:', require('fs').existsSync(staticPath));
  console.log('Index.html exists:', require('fs').existsSync(indexPath));
  app.use(express.static(staticPath));
  //console.log('Registering route: * for static files');
  //app.get('*', (req, res) => {
  //  console.log('Serving index.html for:', req.path);
  //  res.sendFile(indexPath);
  //});
}

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Database sync error:', err));