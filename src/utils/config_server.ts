import { TypeOrmModule } from "@nestjs/typeorm";

export const jwtConstants = {
  secret: "c91250c333c1962ba41a6334010dc368f23fe0502ef46e4e20",
};

export const MAIL_DOMAIN = "goldensuisse.ch";
export const FRONTEND_URL = "http://advisor.goldensuisse.com";
export const SERVER_URL = `https://mail.goldensuisse.ch`;
export const NEXORONE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE2NTAwMjcxNDgsImV4cCI6MTY1MTgyNzE0OH0";

export const socketConfigs = {
  socketServerPort: 5001,
  socketOrigin: `${FRONTEND_URL}`,
  socketNameSpace: "/",
};

export const urls = {
  GS_MAIN_API_BASE_URL: "https://api.goldensuisse.com/v6/",
  GS_MAIN_API_AUTH:
    "39a3370fd4876e70eff211d63f92c333c1962ba41a6631314affa1f5334011cef7f0cc91c35030502ef46e4e200affb2500dc368f23fed304a58c5c5d12f93dc",
  BASE_URL: `${SERVER_URL}/api/v1`,
  PROFILE_PHOTO_URL: "/user/profile_photo/",
  CLIENT_PHOTO_URL: "/client/photo/",
  MESSAGE_FILE_URL: "/message/file/",
};

export const zoomConfig = {
  Live: {
    APIKey: "5YE7qMieSAex-_ZWeKU3NQ",
    APISecret: "kEGoKAtIKlceHHi9qDcRB8lQCmbskRHk8mCL",
    AppKey: "278pFTI9uY1d15JmrmvcJQYdSBnTZfZCJ1zb",
    AppSecret: "c0aPyjqZJJOgIRgoZLS4k6VZnP4seqTIbP1F",
  },
  Test: {
    APIKey: "L7zN2iNBSueN05lEZeENZw",
    APISecret: "UxiehLD9XO02xEPaeqY3Q3HRG75q4TSJCZkZ",
    AppKey: "278pFTI9uY1d15JmrmvcJQYdSBnTZfZCJ1zb",
    AppSecret: "c0aPyjqZJJOgIRgoZLS4k6VZnP4seqTIbP1F",
  },
};

export const imapConfig = {
  host: `mail.${MAIL_DOMAIN}`,
  port: 993,
  secure: true,
  auth: {
    user: `mail@${MAIL_DOMAIN}`,
    pass: "Password123@dev",
  },
  tls: {
    rejectUnauthorized: false,
  },
};
export const smtpConfig = { ...imapConfig, port: 465 }

export const TypeOrmModules = [
  TypeOrmModule.forRoot({
    type: "mysql",
    host: "10.10.20.152",
    port: 3306,
    username: "gcb",
    password: "Tr3@rExBepfNsNHV=HLFhs6JWdjv24",
    database: "gs_advisor",
    entities: ["dist/**/**.entity{.ts,.js}"],
    synchronize: false,
  }),
  TypeOrmModule.forRoot({
    name: "vmailConnection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "gcb",
    password: "Password123@dev",
    database: "vmail",
    entities: ["dist/email/entities/forwardings.entity1.js"],
    synchronize: false,
  })
]
