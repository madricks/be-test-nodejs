const Article = require('../../models/article.model');
const Author = require('../../models/author.model');
const Comment = require('../../models/comment.model');

const resolvers = {
  Query: {
    getAuthors: async () => {
      return await Author.find();
    },

    getArticles: async (_parent, args, _context, _info) => {
      const { page = 1, limit = 10 } = args.pagination;

      const orderBy = {};
      if (args.orderBy) {
        orderBy[args.orderBy.field] = args.orderBy.order === 'ASC' ? 1 : -1;
      }

      const filter = {};
      if (args.filter) {
        filter['author'] = args.filter.authorId;
      }

      const articleFetched = await Article.find(filter)
        .sort(orderBy)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('author', 'name')
        .exec();

      // get total documents in the Article collection
      const count = await Article.count(filter);

      const articles = articleFetched.map((article) => {
        return {
          id: article._id,
          title: article.title,
          body: article.body,
          author: {
            id: article.author._id,
            name: article.author.name
          },
          createdAt: new Date(article.createdAt).toISOString()
        };
      });

      console.log(count);

      return {
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        },
        articles
      };
    },

    getArticle: async (_parent, { id }, _context, _info) => {
      const article = await Article.findById(id).populate('author', 'name');
      article.createdAt = new Date(article.createdAt).toISOString();
      return article;
    },

    getComments: async (_parent, { articleId }, _context, _info) => {
      const comments = await Comment.find({ article: articleId });

      return comments.map((comment) => {
        return {
          id: comment._id,
          text: comment.text,
          createdAt: new Date(comment.createdAt).toISOString()
        };
      });
    }
  },

  Mutation: {
    createAuthor: async (parent, args, context, info) => {
      const { name } = args.author;
      const author = new Author({ name });
      await author.save();
      return author;
    },

    createArticle: async (parent, args, context, info) => {
      const { title, body, authorId } = args.article;
      const article = new Article({ title, body, author: authorId });
      await article.save();
      return article;
    },

    deleteArticle: async (parent, args, context, info) => {
      const { id } = args;
      await Article.findByIdAndDelete(id);
      return `Article with id ${id} deleted`;
    },

    updateArticle: async (parent, args, context, info) => {
      const { id } = args;
      const { title, body } = args.article;
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (body !== undefined) updates.body = body;
      const article = await Article.findByIdAndUpdate(id, updates, { new: true });

      return article;
    },

    createComment: async (parent, args, context, info) => {
      const { articleId } = args;
      const { text } = args.comment;

      const comment = new Comment({ text, article: articleId });
      await comment.save();
      return comment;
    },

    deleteComment: async (parent, args, context, info) => {
      const { id } = args;
      await Comment.findByIdAndDelete(id);
      return `Comment with id ${id} deleted`;
    },

    updateComment: async (parent, args, context, info) => {
      const { id } = args;
      const { text } = args.comment;
      const updates = {};
      if (text !== undefined) updates.text = text;

      const comment = await Comment.findByIdAndUpdate(id, updates, { new: true });

      return comment;
    }
  }
};

module.exports = resolvers;
