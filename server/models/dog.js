/* eslint-disable no-use-before-define, max-len, func-names, no-unused-expressions */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String,
          required: true,
          minlength: 3, // there is also maxlength
          validate: { validator: duplicateDogNameValidator } }, // duplicateDogNameValidator could also be inline function
  age: { type: Number },
  health: { type: Number, min: 0, max: 100 },
  toy: { type: String, enum: ['bones', 'squeaky', 'frisbee'] },
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.feed = function () { // instance method
  this.health < 90 ? this.health += 10 : this.health = 100;
};

function duplicateDogNameValidator(dogName, cb) {
  // two types of validators:
  // synchronous - checking things in memeory without going to db.  Synchronous validators return a boolean
  // asynchronous - checks things in db. These need a callback, that has a boolean in the cb.
  this.model('Dog').find({ name: dogName }, (err, dogs) => {
    // when .find returns something, that is called 'yielding'
    cb(!(dogs.length));
  });
}

module.exports = mongoose.model('Dog', schema);
