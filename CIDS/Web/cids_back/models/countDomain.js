const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//required: true -> 필수 

const countDomainSchema = new Schema({
  url_domain : {
    type: String,
    required: true
  },
  hit : {
    type: Number,
    default: 0
  },
  created_date : {
    type: Date,
    default: Date.now 
  },
  updated_date : {
    type: Date,
    default: Date.now     
  }

});

module.exports = mongoose.model('CountDomain', countDomainSchema);