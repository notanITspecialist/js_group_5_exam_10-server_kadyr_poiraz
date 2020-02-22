const express = require('express');

const news = require('./app/news');
const comments = require('./app/comments');
const config = require('./config');
const mysqlDb = require("./mysqlDb");

const app = express();

app.use(express.json());
app.use('/news', news);
app.use('/comments', comments);

const run = async () => {
    await mysqlDb.connect();

    app.listen(config.port, () => {
        console.log(`HTTP server start on port ${config.port}`);
    });

    process.on('exit', () => {
        mysqlDb.disconnect();
    })
};

run().catch(e => {
    console.log(e);
});