namespace NodeJS {
  interface ProcessEnv {
    // Application
    NODE_ENV: string;
    PORT: number;
    // Db
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_USERNAME: string;
    DB_PORT: number;
    DB_TYPE: string;
    // S3
    S3_SECRET_KEY: string;
    S3_ACCESS_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT: string;
    // Jwt Secret key
    COOKIE_SECRET_KEY: string;
    OTP_JWT_SECRET_KEY:string
    REFRESH_TOKEN_SECRET_KEY:string
    ACCESS_TOKEN_SECRET_KEY:string
  }
}
