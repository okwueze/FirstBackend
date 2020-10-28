const express = require('express')
const router = new express.Router();
const admin = require('../controllers/admin.controllers');

router.post('/register', admin.register);
router.post('/login', admin.login)

module.exports = router;  

// once you import controllers you need to export the router and import it in server.js