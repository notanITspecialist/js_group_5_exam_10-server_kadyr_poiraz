const express = require('express');

const news = require('./app/news');
const config = require('./config');

const app = express();

app.use('/news', news);

const run = async () => {
  app.listen(config.port, () => {
      console.log(`HTTP server start on port ${config.port}`);
  });
};

run().catch(e => {
    console.log(e);
});