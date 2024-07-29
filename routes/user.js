const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.post('/signup', controller.userpost);
router.post('/login', controller.loginpost);
router.post('/expense', controller.expensepost);
router.delete('/expense/:id', controller.expensedelete);
router.get('/expense', controller.expenseget);

module.exports = router;
