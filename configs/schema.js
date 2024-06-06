import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const JsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  form: text("form").notNull(),
  theme: varchar("theme"),
  background: varchar("background"),
  style: varchar("style"),
  CreatedBy: varchar("CreatedBy").notNull(),
  CreatedDate: varchar("CreatedDate").notNull(),
  enableSignIn: boolean("enableSignIn").default(false),
});

export const userResponses = pgTable("userResponses", {
  id: serial("id").primaryKey(),
  jsonResponse: text("jsonResponse").notNull(),
  CreatedBy: varchar("CreatedBy").default("anonymous"),
  CreatedAt: varchar("CreatedAt").notNull(),
  formRef: integer("formRef").references(() => JsonForms.id),
});
