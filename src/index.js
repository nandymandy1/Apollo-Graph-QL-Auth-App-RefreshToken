// Package Imports
import cors from "cors";
import express from "express";
import consola from "consola";
import mongoose from "mongoose";
import typeDefs from "./graphQL/typeDefs";
import resolvers from "./graphQL/resolvers";
import { ApolloServer } from "apollo-server-express";

// Constants
import { DB, IN_PORD, APP_PORT } from "./config";

const app = express();
app.use(cors());
app.disable("x-powered-by");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //   schemaDirectives,
  playground: IN_PORD
    ? false
    : {
        settings: {
          "request.credentials": "include",
        },
      },
  context: ({ req, res }) => ({ req, res }),
  uploads: {
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20,
  },
});

// Setup Static directory
const startApp = async () => {
  try {
    // Database Connection
    await mongoose.connect(DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    consola.success({
      message: `Successfully connected to the Database ${DB}`,
      badge: true,
    });
    server.applyMiddleware({ app, cors: false });
    app.listen({ port: APP_PORT }, () =>
      consola.success({
        message: `Server started on port http://localhost:${APP_PORT}${server.graphqlPath}`,
        badge: true,
      })
    );
  } catch (err) {
    consola.error({
      message: err.message,
      badge: true,
    });
  }
};

startApp();
