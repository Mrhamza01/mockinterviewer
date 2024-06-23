import { serial, text, pgTable, pgSchema, varchar } from 'drizzle-orm/pg-core';

export const MockinterviewSchema = pgSchema("MockinterviewSchema");


export const Mockinterview =  MockinterviewSchema.table('mockinterview', {
  id: serial('id').primaryKey(),
  mockId: varchar('mockId').notNull(),
  jsonmockResponse: text('jsonmockResponse').notNull(),
  jobPosition: varchar('jobPosition').notNull(),
  jobDescription: varchar('jobDescription').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt').notNull(),
 
  
});
