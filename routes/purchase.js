const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchaseController');

router.get('/premium', purchaseController.premiumget);
router.post('/updateTransactionStatus', purchaseController.updateTransaction);
router.get('/leaderboard',purchaseController.getUserLeaderBoard)

module.exports = router;
