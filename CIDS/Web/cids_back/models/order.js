const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const orderSchema = new Schema({
  user_id: {
    //결제 user
    type: Number,
    Ref : 'User',
    required : true
  },
  merchant_uid:{
    //주문 번호
    type: String,
    required : true
  },
  status:{
    type: String,
    required : true
  },
  created_date : {
    type: Date,
    default: Date.now
  }

});
orderSchema.plugin(mongooseAutoInc.plugin, 'Order');
module.exports = mongoose.model('Order', orderSchema);