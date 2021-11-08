const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 4000;

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // enable all cors
  app.use(cors());

  app.use((req, res) => {
    res.send('ZettaByte BE Test');
  });

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&ssl=true`;
  const options = { useUnifiedTopology: true, useNewUrlParser: true };

  await mongoose
    .connect(uri, options)
    .then(() => app.listen(port, () => console.log(`Server is running on port ${port}`)))
    .catch((error) => {
      throw error;
    });
}
startServer();
