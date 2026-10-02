import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const portfolioContent = sqliteTable('portfolio_content',{
 id:integer('id').primaryKey(), content:text('content').notNull(),revision:integer('revision').notNull().default(1),updatedAt:text('updated_at').notNull(),updatedBy:text('updated_by').notNull()
});
export const portfolioAssets = sqliteTable('portfolio_assets',{
 id:text('id').primaryKey(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),createdAt:text('created_at').notNull(),createdBy:text('created_by').notNull()
});
