const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const Author = mongoose.model('Author', AuthorSchema);
module.exports = Author;
