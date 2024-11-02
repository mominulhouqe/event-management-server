const express = require('express');
const { teamsCollections } = require('..');
const router = express.Router();


router.get('/teams', async (req, res) => {
    const result = await teamsCollections.find().toArray()
    res.send(result)
})

module.exports = router;