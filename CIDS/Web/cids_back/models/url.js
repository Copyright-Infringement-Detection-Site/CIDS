const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const urlSchema = new Schema({
  url: {
    type: String
  },
  keyword_id: {
    type: Number,
    required: true,
    ref: 'Keyword'  
  },
  words: {
    type: Array,
  },
  created_date: {
    type: Date,
    default: Date.now
  }

});
urlSchema.plugin(mongooseAutoInc.plugin, 'Url');
module.exports = mongoose.model('Url', urlSchema);