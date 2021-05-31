const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const keywordSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    Ref: 'User'
  },
  keyword: {
    type: String
  },
  status: {
    type: Number
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date
  }
    
});
keywordSchema.plugin(mongooseAutoInc.plugin, 'Keyword');
module.exports = mongoose.model('Keyword', keywordSchema);