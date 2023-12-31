import { pgTable, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

const createdAt = timestamp(`createdAt`, {
  withTimezone: true,
})
  .notNull()
  .defaultNow();

const updatedAt = timestamp(`updatedAt`, {
  withTimezone: true,
})
  .notNull()
  .defaultNow();

export const todoTable = pgTable(`todo`, {
  createdAt,
  updatedAt,
  id: varchar(`id`).primaryKey(),
  text: varchar(`text`),
  completed: boolean(`completed`).default(false),
  userId: varchar(`userId`),
  realtimeSessionId: varchar(`realtimeSessionId`),
});
