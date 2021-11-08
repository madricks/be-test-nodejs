const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author'
    }
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
