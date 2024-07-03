"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmModules = exports.smtpConfig = exports.imapConfig = exports.zoomConfig = exports.urls = exports.socketConfigs = exports.NEXORONE_TOKEN = exports.SERVER_URL = exports.FRONTEND_URL = exports.MAIL_DOMAIN = exports.jwtConstants = void 0;
const typeorm_1 = require("@nestjs/typeorm");
exports.jwtConstants = {
    secret: "c91250c333c1962ba41a6334010dc368f23fe0502ef46e4e20",
};
exports.MAIL_DOMAIN = "goldensuisse.ch";
exports.FRONTEND_URL = "http://192.168.8.14:3000";
exports.SERVER_URL = "http://192.168.8.14";
exports.NEXORONE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE2NTAwMjcxNDgsImV4cCI6MTY1MTgyNzE0OH0";
exports.socketConfigs = {
    socketServerPort: 5001,
    socketOrigin: `${exports.FRONTEND_URL}`,
    socketNameSpace: "/",
};
exports.urls = {
    GS_MAIN_API_BASE_URL: "https://api.goldensuisse.com/v6/",
    GS_MAIN_API_AUTH: "39a3370fd4876e70eff211d63f92c333c1962ba41a6631314affa1f5334011cef7f0cc91c35030502ef46e4e200affb2500dc368f23fed304a58c5c5d12f93dc",
    BASE_URL: `${exports.SERVER_URL}:3001/api/v1`,
    PROFILE_PHOTO_URL: "/user/profile_photo/",
    CLIENT_PHOTO_URL: "/client/photo/",
    MESSAGE_FILE_URL: "/message/file/",
};
exports.zoomConfig = {
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
exports.imapConfig = {
    host: `mail.${exports.MAIL_DOMAIN}`,
    port: 993,
    secure: true,
    auth: {
        user: `mail@${exports.MAIL_DOMAIN}`,
        pass: "Password123@dev",
    },
    tls: {
        rejectUnauthorized: false,
    },
};
exports.smtpConfig = Object.assign(Object.assign({}, exports.imapConfig), { port: 465 });
exports.TypeOrmModules = [
    typeorm_1.TypeOrmModule.forRoot({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "12345678",
        database: "gs_advisor",
        entities: ["dist/**/**.entity{.ts,.js}"],
        synchronize: false,
    }),
    typeorm_1.TypeOrmModule.forRoot({
        name: "vmailConnection",
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "12345678",
        database: "vmail",
        entities: ["dist/email/entities/forwardings.entity1.js"],
        synchronize: false,
    })
];
//# sourceMappingURL=config_local.js.map