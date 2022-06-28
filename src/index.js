const express = require('express')
const { body, validationResult } = require('express-validator')
const cors = require('cors')
const users = require('./users.json')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

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

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})
