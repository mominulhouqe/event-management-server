const express = require('express');
const { commentCollection } = require('..');
const router = express.Router();

router.post("/comment", async (req, res) => {
    const comment = req.body;
    console.log(comment)
    const result = await commentCollection.insertOne(comment);
    res.send(result);
})

router.get('/comment', async (req, res) => {
    const result = await commentCollection.find().toArray()
    res.send(result)

})

module.exports = router;