# Database process (Supabase with DrizzleORM)

Supabase is an open-source Firebase alternative that uses a PostgreSQL database. We are using DrizzleORM to easily interact with our database and utilize POWERFUL migrations

To add a schema, follow these steps:
- Create a file in `/src/schemas/PLURAL_SCHEMANAME.js`
- Define the fields using DrizzleORM notation [Documentation](https://orm.drizzle.team/docs/column-types/pg)
- Run `npm run generate` to generate the migration for the new or altered database. Some questions may pop up.
- Run `npm run migrate` to migrate the database. 

After doing this, your schema is ready to be used. Write your [queries](https://orm.drizzle.team/docs/rqb) in the same schema file and call them wherever you need. 
 