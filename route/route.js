const express = require('express')
const router = express.Router();
const controller = require('../Controller/allController')



router.post('/url/shorten',controller.posturl)





module.exports = router