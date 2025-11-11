const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');


router.post('/quick_match', async (req, res) => {
    console.log(req.body);

});

module.exports = router;