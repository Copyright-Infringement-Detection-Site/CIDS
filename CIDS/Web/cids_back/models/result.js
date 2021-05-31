const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const resultSchema = new Schema({
    keyword_id: {
        type: Number,
        required: true,
        ref: 'Keyword'  
    },
    url: {
        type: String,
        required: true,
        ref: 'Url'
    },
    label: {
        type: Number,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }

});
resultSchema.plugin(mongooseAutoInc.plugin, 'Result');
module.exports = mongoose.model('Result', resultSchema);