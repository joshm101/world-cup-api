const express = require('express');
const router = express.Router();

const api = require('./api')

router.use((req, res, next) => {
  // Set CORS headers
  res.append('Access-Control-Allow-Origin', ['*'])
  res.append('Access-Control-Allowed-Methods', 'GET')
  res.append('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
router.use('/api', api)

module.exports = router;
