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

export const todoListTable = pgTable(`todoList`, {
  createdAt,
  updatedAt,
  id: varchar(`id`).primaryKey(),
});

export const todoTable = pgTable(`todo`, {
  createdAt,
  updatedAt,
  id: varchar(`id`).primaryKey(),
  todoListId: varchar(`todoListId`).references(() => todoListTable.id, {
    onDelete: `cascade`,
    onUpdate: `cascade`,
  }),
  text: varchar(`text`),
  completed: boolean(`completed`).default(false),
});
