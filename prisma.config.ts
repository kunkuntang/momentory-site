import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

const DB_HOST = env('DB_HOST');
const DB_PORT = env('DB_PORT');
const DB_USER = env('DB_USER');
const DB_PASSWORD = env('DB_PASSWORD');
const DB_NAME = env('DB_NAME');
const DATABASE_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
});