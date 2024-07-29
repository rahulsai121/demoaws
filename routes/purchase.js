const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.get('/premium', controller.premiumget);
router.post('/updateTransactionStatus', controller.updateTransaction);

module.exports = router;
