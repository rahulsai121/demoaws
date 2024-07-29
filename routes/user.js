const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.userpost);
router.post('/login', userController.loginpost);
router.post('/expense', userController.expensepost);
router.delete('/expense/:id', userController.expensedelete);
router.get('/expense', userController.expenseget);

module.exports = router;
