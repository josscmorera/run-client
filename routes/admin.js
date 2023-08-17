var express = require('express');
const { createAdmin, loginAdmin } = require('../controller/adminController');
var router = express.Router();

router.get('/new', createAdmin);
router.post('/login', loginAdmin);

module.exports = router;
