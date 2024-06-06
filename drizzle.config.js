import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://FormDB_owner:WBaEk1jFrTN5@ep-young-bird-a53gkj9j.us-east-2.aws.neon.tech/FormDB?sslmode=require",
  },
});
