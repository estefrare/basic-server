const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  id:  String,
  endpoint: String,
  method:   String,
  geo: Object,
  body: Object
},
{ timestamps: true },
);

module.exports = mongoose.model('Logs', logSchema);