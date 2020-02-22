const express = require('express');

const router = express.Router();
const mysqlDb = require("../mysqlDb");

router.get('/', async (req, res) => {
    if(req.query.news_id) {
        const data = await mysqlDb.getConnection().query(
            `SELECT * FROM news_list WHERE id = ?`,
            [req.query.news_id]
        );
        if(data[0]) {
            const data = await mysqlDb.getConnection().query(
                `SELECT * FROM comments WHERE id_news = ?`,
                [req.query.news_id]
            );
            res.send(data);
            return;
        }
    }
    const data = await mysqlDb.getConnection().query(
        `SELECT * FROM comments`
    );
    res.send(data);
});

router.get('/:id', async (req, res) => {
    const data = await mysqlDb.getConnection().query(
        `SELECT * FROM news_list WHERE id = ?`,
        [req.params.id]
    );
    if(!data[0]) {
        res.send({error: 'New not found'});
        return;
    }
    res.send(data[0]);
});

router.delete('/:id', async (req, res) => {
    await mysqlDb.getConnection().query(
        `DELETE FROM comments WHERE id = ?`,
        [req.params.id]
    );
    res.send(`Comments with id ${req.params.id} deleted`);
});

router.post('/', async (req, res) => {
    const data = req.body;

    if(data.author) {
        await mysqlDb.getConnection().query(
            `INSERT INTO comments (id_news, author, comment) VALUES
         (?,?,?)`,
            [data.id_news, data.author, data.comment]
        );
    } else {
        await mysqlDb.getConnection().query(
            `INSERT INTO comments (id_news, comment) VALUES
         (?,?)`,
            [data.id_news, data.comment]
        );
    }

    res.send(`Comment to new with id ${data.id_news} added`);
});

module.exports = router;