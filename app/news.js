const path = require('path');
const fs = require('fs');

const express = require('express');
const multer = require("multer");
const nanoid = require('nanoid');

const router = express.Router();
const config = require("../config");
const mysqlDb = require("../mysqlDb");

const storage = multer.diskStorage({
   destination: (req, file, cd) => cd(null, config.uploadPath),
   filename: (req, file, cd) => cd(null, nanoid() + path.extname(file.originalname))
});

const upload = multer({storage});

router.get('/', async (req, res) => {
    const data = await mysqlDb.getConnection().query(
        `SELECT title, image, date FROM news_list`
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
    const data = await mysqlDb.getConnection().query(
        `SELECT * FROM news_list WHERE id = ?`,
        [req.params.id]
    );
    fs.unlinkSync(`${config.uploadPath}/${data[0].image}`);
    await mysqlDb.getConnection().query(
        `DELETE FROM news_list WHERE id = ?`,
        [req.params.id]
    );
    res.send(`New with id ${req.params.id} deleted`);
});

router.post('/', upload.single('image'), async (req, res) => {
   const data = req.body;

   if (req.file) {
      data.image = req.file.filename;
   }

    await mysqlDb.getConnection().query(
        `INSERT INTO news_list (title, content, image) VALUES
         (?,?,?)`,
        [data.title, data.content, data.image]
    );

   res.send('New added');
});

module.exports = router;