var mongoose = require('mongoose');
mongoose.connect('mongodb://eval-me:randomshit@poseidon4o.eu/eval-me');

module.exports = {
    
    job: mongoose.model('job', mongoose.Schema({
        data: String,
        result: { type:String, default: ''},
        done: { type:Boolean, default: false }
    })),
}


