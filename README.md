# Database process

To add a schema, follow these steps:
- Create a file in `/src/schemas/PLURAL_SCHEMANAME.js`
- Define the fields using DrizzleORM notation [Documentation](https://orm.drizzle.team/docs/column-types/pg)
- Run `npm run generate` to generate the migration for the new or altered database. Some questions may pop up.
- Run `npm run migrate` to migrate the database. 
 