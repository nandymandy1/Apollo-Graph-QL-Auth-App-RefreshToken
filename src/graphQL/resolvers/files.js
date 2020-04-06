import { File } from "../../models";

export default {
  Query: {
    files: async () => await File.find(),
  },
  Mutation: {
    async uploadImage(parent, { file }, { req }, info) {
      const { filename, mimetype, createReadStream } = await file;
      const stream = createReadStream();
      // Promisify the stream and store the file, then ...
      return true;
    },
  },
};
