const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSession = new Schema({
    id: {
        type: String,
        required: true
      },
    timestamp: {
        type: Date,
        default: Date.now
      },
    isAuth: {
        type: Boolean, 
        default: false
    }
});

usersSession.methods.authInfo = function(){
    return {
        id : this.id,
        timestamp: this.timestamp,
        isAuth : this.isAuth
    };
};


module.exports = userSession = mongoose.model('session_id', usersSession);