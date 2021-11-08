const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum Order {
    ASC
    DESC
  }

  type PaginationOption {
    totalItems: Int
    totalPages: Int
    currentPage: Int
  }

  type Author {
    id: ID!
    name: String!
  }

  type ArticleWithPagination {
    pagination: PaginationOption
    articles: [Article]
  }

  type Article {
    id: ID!
    title: String!
    body: String!
    createdAt: String!
    author: Author!
  }

  type Comment {
    id: ID!
    text: String!
    createdAt: String!
    article: Article!
  }

  type Query {
    getAuthors: [Author]

    getArticles(orderBy: OrderBy, filter: ArticleFilter, pagination: Pagination): ArticleWithPagination
    getArticle(id: ID): Article

    getComments(articleId: ID): [Comment]
  }

  input OrderBy {
    field: String!
    order: Order!
  }

  input Pagination {
    page: Int!
    limit: Int!
  }

  input ArticleFilter {
    authorId: ID!
  }

  input AuthorInput {
    name: String!
  }

  input ArticleInput {
    title: String!
    body: String!
    authorId: ID!
  }

  input ArticleUpdate {
    title: String
    body: String
  }

  input CommentInput {
    text: String!
  }

  input CommentUpdate {
    text: String!
  }

  type Mutation {
    createAuthor(author: AuthorInput): Author

    createArticle(article: ArticleInput): Article
    updateArticle(id: ID, article: ArticleUpdate): Article
    deleteArticle(id: ID): String

    createComment(articleId: ID, comment: CommentInput): Comment
    updateComment(id: ID, comment: CommentUpdate): Comment
    deleteComment(id: ID): String
  }
`;

module.exports = typeDefs;
