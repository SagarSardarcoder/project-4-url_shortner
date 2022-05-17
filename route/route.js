const express = require('express')
const router = express.Router();
const controller = require('../Controller/allController')



router.post('/url/shorten',controller.posturl)
router.get('/:code' , controller.get )




module.exports = router