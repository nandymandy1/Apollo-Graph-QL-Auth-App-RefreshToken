import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    profile: User
    users: [User!]!
    user(id: ID): User
    refreshTokens: Auth!
    login(username: String!, password: String!): Auth!
  }

  extend type Mutation {
    register(
      name: String!
      email: String!
      username: String!
      password: String!
    ): Auth!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    createdAt: String!
  }

  type Auth {
    user: User!
    token: String!
    refreshToken: String!
  }
`;
