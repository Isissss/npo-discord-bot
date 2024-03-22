import "dotenv/config"; 

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default {
  schema: "./src/schemas",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} 