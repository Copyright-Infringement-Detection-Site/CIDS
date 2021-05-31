const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const paymentSchema = new Schema({
  amount: {
    type: Number,
    required : true
  },
  name:{
    type: String
  }

});
paymentSchema.plugin(mongooseAutoInc.plugin, 'Payment');
module.exports = mongoose.model('Payment', paymentSchema);