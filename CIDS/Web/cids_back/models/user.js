const mongoose = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;


mongooseAutoInc.initialize(mongoose.connection);

const userSchema = new Schema({
    login_id: {
        type: String,
        required: true,
        unique: true
    },
    passwd: {
        type: String,
        required: true
    },
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
    },
    telephone: String,
    img_path: String,
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
    },
    user_type: { type: String, default: "unpaid_user" },
    img_path:{
      type: String,
      default: 'basic_profile.png'
    }
});

userSchema.plugin(mongooseAutoInc.plugin, 'User');
module.exports = mongoose.model('User', userSchema);