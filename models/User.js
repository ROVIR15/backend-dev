const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: {
        type: String,
        required: true
      },
    password: {
       type: String,
       required: true
    },
    email: {
        type: String,
        required: true
      },
    date: {
        type: Date,
        default: Date.now
      }
});

usersSchema.pre('save', async function(next){
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

usersSchema.methods.setPassword = async function(password) {
  const user = this;//app.use('/logout', logout);

  const hash = bcrypt.hash(this.password, 10);
  this.password = hash; 
};

usersSchema.methods.isValidPassword = async function(password){
  const user = this;
  const validate = bcrypt.compare(password, this.password);
  return validate;
}

usersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

usersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    token: this.generateJWT(),
  };
};

module.exports = Users = mongoose.model('member', usersSchema);