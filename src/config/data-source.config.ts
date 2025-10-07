import * as dotenv from "dotenv";

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,

});

export const config = {
    name: "default",
    type: process.env.TYPEORM_TYPE,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [process.env.TYPEORM_ENTITIES],
    migrations: [__dirname + process.env.TYPEORM_MIGRATIONS],
    synchronize: process.env.TYPEORM_SYNCHRONIZE,
    dropSchema: process.env.TYPEORM_DROP_SCHEMA,
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN
};

export const configNoSynchronize = {
    name: "default",
    type: process.env.TYPEORM_TYPE,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [process.env.TYPEORM_ENTITIES],
    migrations: [__dirname + process.env.TYPEORM_MIGRATIONS],
    migrationsRun: false,
    synchronize: false,
};
