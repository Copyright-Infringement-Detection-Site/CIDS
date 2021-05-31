const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const postSchema = new Schema({
    user_id: {
        type: Number,
        required: true,
        ref: 'User'
    },
    user_login_id: {
        type: String,
        required: true
    },
    post_type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    hit: {
        type: Number,
        default: 0
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


postSchema.plugin(mongooseAutoInc.plugin, 'Post');
module.exports = mongoose.model('Post', postSchema);