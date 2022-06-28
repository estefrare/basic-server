const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  ip:  String,
  endpoint: String,
  method:   String,
  geo: Object,
  googleMaps: String,
  body: Object,
},
{ timestamps: true },
);

module.exports = mongoose.model('Logs', logSchema);