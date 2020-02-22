const path = require('path');
const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public', 'uploads'),
  port: 8000,
  database: {
    "host": "localhost",
    "user": "user",
    "password": "19122002",
    "database": "news"
  }
};