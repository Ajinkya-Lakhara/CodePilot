const express = require('express');
const router = express.Router();
const runCode = require('../services/compiler.service');

router.post('/run-code', async (req, res) => {
    const { languageId, code, input } = req.body;
console.log('POST /run-code hit');

    if (!languageId || !code) {
        return res.status(400).json({ error: 'Language ID and code are required.' });
    }

    try {
        const result = await runCode(languageId, code, input);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to execute code.' });
    }
});

module.exports = router;
