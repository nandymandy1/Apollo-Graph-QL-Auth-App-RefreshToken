import { gql } from "apollo-server-express";

export default gql`
  type Image {
    id: ID
    name: String
    url: String
  }
  extend type Query {
    files: [Image]
  }
  extend type Mutation {
    uploadImage(name: String!, file: Upload!): Boolean
  }
`;
