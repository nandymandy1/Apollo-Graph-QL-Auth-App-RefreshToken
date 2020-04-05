export const {
  DB,
  APP_PORT,
  NODE_ENV,
  APP_SECRET,
  APP_REFRESH_TOKEN,
} = process.env;

export const IN_PORD = NODE_ENV === "production";
