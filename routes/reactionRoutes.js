const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Reactions route working!');
});

module.exports = router;
