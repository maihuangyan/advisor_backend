export declare const jwtConstants: {
    secret: string;
};
export declare const MAIL_DOMAIN = "goldensuisse.ch";
export declare const FRONTEND_URL = "http://advisor.goldensuisse.com";
export declare const SERVER_URL = "https://mail.goldensuisse.ch";
export declare const NEXORONE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE2NTAwMjcxNDgsImV4cCI6MTY1MTgyNzE0OH0";
export declare const socketConfigs: {
    socketServerPort: number;
    socketOrigin: string;
    socketNameSpace: string;
};
export declare const urls: {
    GS_MAIN_API_BASE_URL: string;
    GS_MAIN_API_AUTH: string;
    BASE_URL: string;
    PROFILE_PHOTO_URL: string;
    CLIENT_PHOTO_URL: string;
    MESSAGE_FILE_URL: string;
};
export declare const zoomConfig: {
    Live: {
        APIKey: string;
        APISecret: string;
        AppKey: string;
        AppSecret: string;
    };
    Test: {
        APIKey: string;
        APISecret: string;
        AppKey: string;
        AppSecret: string;
    };
};
export declare const imapConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls: {
        rejectUnauthorized: boolean;
    };
};
export declare const smtpConfig: {
    port: number;
    host: string;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls: {
        rejectUnauthorized: boolean;
    };
};
export declare const TypeOrmModules: import("@nestjs/common").DynamicModule[];
