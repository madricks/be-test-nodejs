const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
