const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const commentSchema = new Schema({
    user_login_id: {
        type: String,
        required: true,
    },
    post_id: {
        type: Number,
        required: true,
        ref: 'Post'
    },
    content: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    updated_date: {
        type: Date,
        default: Date.now()
    }
});


commentSchema.plugin(mongooseAutoInc.plugin, 'Comment');
module.exports = mongoose.model('Comment', commentSchema);