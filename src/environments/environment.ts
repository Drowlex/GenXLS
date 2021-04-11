export const environment: any = {
    api  : "dev/api/v1",
    port : process.env.BACKEND_PORT,
    cors : process.env.BACKEND_CORS_ORIGINS,
    database: {
        firebird: {
            host          : process.env.FIREBIRD_HOST,
            port          : process.env.FIREBIRD_PORT,
            database      : process.env.FIREBIRD_DATABASE,
            user          : process.env.FIREBIRD_USER,
            password      : process.env.FIREBIRD_PASSWORD,
            lowercase_keys: process.env.FIREBIRD_LOWERCASE_KEYS,
            role          : process.env.FIREBIRD_ROLE,
            pageSize      : process.env.FIREBIRD_PAGESIZE,
        },
    }
}

