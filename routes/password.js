const express = require('express');
const router = express.Router();
const passwordController = require('../controller/forgotpasswordController');

router.post('/forgotpassword', passwordController.forgotPassword);

module.exports = router;
