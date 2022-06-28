const express = require('express')
const { body, validationResult } = require('express-validator')
const cors = require('cors')
const mongoose = require('mongoose');
const geoip = require('geoip-lite');

require('dotenv').config()

const users = require('./users.json')
const Log = require('./Log')

const app = express()
const port = process.env.PORT || 3000

app.set('trust proxy', true)
app.use(cors())
app.use(express.json())

app.use(async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const geo = geoip.lookup(ip)
    const latitude = geo?.ll[0]
    const longitude = geo?.ll[1]

    const newLog = new Log({
      ip,
      endpoint: req.url,
      method: req.method,
      body: req.body,
      geo,
      googleMaps: `https://www.google.com/maps/place/${latitude},${longitude}`,
    });
    await newLog.save();
  } catch (error) {
    console.log(error)
  }
  next();
})

app.post('/login',
  body('email')
    .isEmail()
    .withMessage('Email is not valid'),
  body('password')
    .isAlphanumeric()
    .withMessage('Password must have only letters and numbers')
    .isLength({ min: 7 })
    .withMessage('Name must have more than 7 letters'),
  (req, res) => {
    const { errors } = validationResult(req)
    if(errors.length) {
      res.status(400).json({ success: false, errors })
    } else {
      if(req.body.email !== 'valeria@gmail.com' || req.body.password !== 'lppa2022') {
        res.status(400).json({ error: true, message: "Wrong email or password" })
      } else {
        res.status(200).json({ error: false, message: "User logged" })
      }
    }
  }
)

app.get('/users',
  (req, res) => {
    res.status(200).json({ error: false, data: users })
  }
)
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server app listening on port ${port}`)
    })
  })
  .catch((error) => {
    console.log(`Database Error`, error.toString())
  })
