declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGODB_URI: string;
    NODE_ENV?: string;
  }
}
