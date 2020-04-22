import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    posts: [Post!]!
    myPosts: [Post!]!
    postById(id: ID!): Post!
  }

  extend type Mutation {
    deletePost(id: ID!): PostResp!
    addPost(newPost: PostInput!): PostResp!
    editPost(id: ID!, updatedPost: PostInput!): PostResp!
  }

  input PostInput {
    title: String!
    body: String!
  }

  type Post {
    id: ID!
    author: User!
    body: String!
    title: String!
    createdAt: String!
    updatedAt: String!
  }

  type PostResp {
    post: Post!
    message: String!
  }
`;
